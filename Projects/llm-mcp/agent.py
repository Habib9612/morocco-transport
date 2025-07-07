import os
import json
import requests
import time
import re
from typing import Dict, List, Tuple

# Configuration
PROJECT_PATH = os.path.expanduser("~/Projects/llm-mcp/autogen")
MEMORY_FILE = "memory.json"
ALLOWED_EXTENSIONS = ('.py', '.md', '.txt', '.json', '.yaml', '.yml', '.toml', '.cfg', '.ini')
LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions"

class LocalLLMAgent:
    def __init__(self):
        self.memory = self.load_memory()
        
    def load_memory(self) -> Dict:
        """Load memory from JSON file"""
        if not os.path.exists(MEMORY_FILE):
            return {"completed": [], "history": [], "current_task": None}
        try:
            with open(MEMORY_FILE, 'r') as f:
                return json.load(f)
        except:
            return {"completed": [], "history": [], "current_task": None}
    
    def save_memory(self) -> None:
        """Save memory to JSON file"""
        with open(MEMORY_FILE, 'w') as f:
            json.dump(self.memory, f, indent=2)
    
    def read_codebase(self, folder: str, max_chars: int = 15000) -> str:
        """Read codebase files and return as formatted string"""
        all_code = ""
        file_count = 0
        
        for root, dirs, files in os.walk(folder):
            # Skip common directories that aren't useful
            dirs[:] = [d for d in dirs if d not in ['.git', '__pycache__', 'node_modules', '.pytest_cache', 'venv', 'env']]
            
            for file in files:
                if file.endswith(ALLOWED_EXTENSIONS) and not file.startswith('.'):
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, folder)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            if len(content) > 2000:  # Truncate very long files
                                content = content[:2000] + "\n... [truncated]"
                            
                            all_code += f"\n\n--- FILE: {rel_path} ---\n{content}\n"
                            file_count += 1
                            
                            if len(all_code) > max_chars:
                                all_code += "\n\n... [More files truncated for token limit]"
                                break
                    except Exception as e:
                        all_code += f"\n\n--- FILE: {rel_path} ---\n[Error reading file: {e}]\n"
                        
            if len(all_code) > max_chars:
                break
                
        return f"Codebase snapshot ({file_count} files):\n{all_code}"
    
    def ask_qwen(self, task: str, codebase: str) -> str:
        """Send request to Qwen via LM Studio API"""
        print("🧠 Sending task to Qwen...")
        
        system_prompt = """You are an autonomous development agent working on software projects. 
You can read code, analyze it, and provide specific instructions or code modifications.
When suggesting code changes, use this format:

[FILE]: path/to/file.py
[CODE]:
```python
# Your code here
```

Be concise and practical. Focus on actionable improvements."""
        
        user_prompt = f"""Current task: {task}

Previous completed tasks:
{json.dumps(self.memory['completed'][-3:], indent=2)}

Codebase:
{codebase}

Provide specific, actionable guidance or code changes."""
        
        payload = {
            "model": "qwen2.5-coder-3b-instruct",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 2048
        }
        
        try:
            response = requests.post(LM_STUDIO_URL, json=payload, timeout=30)
            response.raise_for_status()
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            return f"Error communicating with LM Studio: {e}"
    
    def parse_response(self, response: str) -> List[Tuple[str, str]]:
        """Parse LLM response for file changes"""
        changes = []
        pattern = r'\[FILE\]:\s*(.+?)\n\[CODE\]:\s*```\w*\n(.*?)```'
        matches = re.findall(pattern, response, re.DOTALL)
        
        for file_path, code in matches:
            changes.append((file_path.strip(), code.strip()))
            
        return changes
    
    def apply_changes(self, changes: List[Tuple[str, str]]) -> None:
        """Apply code changes to files"""
        for file_path, code in changes:
            full_path = os.path.join(PROJECT_PATH, file_path)
            
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            try:
                with open(full_path, 'w', encoding='utf-8') as f:
                    f.write(code)
                print(f"✅ Updated {file_path}")
            except Exception as e:
                print(f"❌ Failed to write {file_path}: {e}")
    
    def run_task(self, task: str) -> None:
        """Execute a single task"""
        print(f"\n🎯 Starting task: {task}")
        
        # Read current codebase
        codebase = self.read_codebase(PROJECT_PATH)
        
        # Get LLM response
        response = self.ask_qwen(task, codebase)
        print(f"\n🧾 Qwen response:\n{response}")
        
        # Parse and apply changes
        changes = self.parse_response(response)
        if changes:
            print(f"\n📝 Applying {len(changes)} file changes...")
            self.apply_changes(changes)
        else:
            print("\nℹ️ No file changes detected. Response was likely analysis or planning.")
        
        # Update memory
        self.memory['completed'].append(task)
        self.memory['history'].append({
            "task": task,
            "response": response,
            "timestamp": time.time()
        })
        self.save_memory()
        
        print(f"\n✅ Task completed: {task}")
    
    def interactive_mode(self) -> None:
        """Run in interactive mode"""
        print("🚀 Local LLM Development Agent Started")
        print(f"📁 Working on project: {PROJECT_PATH}")
        print("💡 Type 'quit' to exit, 'status' for current state\n")
        
        while True:
            try:
                task = input("🎯 What should the LLM work on? > ").strip()
                
                if task.lower() in ['quit', 'exit', 'q']:
                    print("👋 Goodbye!")
                    break
                elif task.lower() == 'status':
                    print(f"\n📊 Status:")
                    print(f"Completed tasks: {len(self.memory['completed'])}")
                    if self.memory['completed']:
                        print("Recent tasks:")
                        for task in self.memory['completed'][-3:]:
                            print(f"  - {task}")
                    continue
                elif not task:
                    continue
                    
                self.run_task(task)
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")

if __name__ == "__main__":
    agent = LocalLLMAgent()
    agent.interactive_mode()
