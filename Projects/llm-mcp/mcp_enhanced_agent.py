import json
import os
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional, Union
import subprocess
import sys
from dataclasses import dataclass
from enum import Enum

class MCPMessageType(Enum):
    INITIALIZE = "initialize"
    CALL_TOOL = "call_tool"
    LIST_TOOLS = "list_tools"
    GET_PROMPT = "get_prompt"
    LIST_PROMPTS = "list_prompts"
    COMPLETE = "complete"
    NOTIFICATION = "notification"

@dataclass
class MCPTool:
    name: str
    description: str
    input_schema: Dict[str, Any]

@dataclass
class MCPContext:
    project_name: str
    model_name: str
    conversation_history: List[Dict[str, Any]]
    session_data: Dict[str, Any]
    created_at: datetime
    last_updated: datetime

class MCPEnhancedDevelopmentAgent:
    def __init__(self, lm_studio_url: str = "http://localhost:1234"):
        self.lm_studio_url = lm_studio_url
        self.memory_file = "mcp_enhanced_memory.json"
        self.contexts_file = "mcp_contexts.json"
        self.memory = self.load_memory()
        self.contexts = self.load_contexts()
        self.session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.current_context = None
        self.mcp_tools = self._initialize_mcp_tools()
        
    def _initialize_mcp_tools(self) -> List[MCPTool]:
        """Initialize MCP tools for file operations, git commands, and code analysis"""
        return [
            MCPTool(
                name="file_read",
                description="Read contents of a file",
                input_schema={
                    "type": "object",
                    "properties": {
                        "file_path": {"type": "string", "description": "Path to the file to read"}
                    },
                    "required": ["file_path"]
                }
            ),
            MCPTool(
                name="git_status",
                description="Get git repository status",
                input_schema={
                    "type": "object",
                    "properties": {
                        "repo_path": {"type": "string", "description": "Path to git repository"}
                    },
                    "required": ["repo_path"]
                }
            ),
            MCPTool(
                name="code_analyze",
                description="Analyze code structure and quality",
                input_schema={
                    "type": "object",
                    "properties": {
                        "file_path": {"type": "string", "description": "Path to code file to analyze"}
                    },
                    "required": ["file_path"]
                }
            )
        ]
        
    def load_memory(self) -> Dict[str, Any]:
        if os.path.exists(self.memory_file):
            try:
                with open(self.memory_file, 'r') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                return self._create_default_memory()
        return self._create_default_memory()
        
    def load_contexts(self) -> Dict[str, MCPContext]:
        """Load MCP contexts for different projects"""
        if os.path.exists(self.contexts_file):
            try:
                with open(self.contexts_file, 'r') as f:
                    data = json.load(f)
                    contexts = {}
                    for name, ctx_data in data.items():
                        contexts[name] = MCPContext(
                            project_name=ctx_data['project_name'],
                            model_name=ctx_data['model_name'],
                            conversation_history=ctx_data['conversation_history'],
                            session_data=ctx_data['session_data'],
                            created_at=datetime.fromisoformat(ctx_data['created_at']),
                            last_updated=datetime.fromisoformat(ctx_data['last_updated'])
                        )
                    return contexts
            except (json.JSONDecodeError, FileNotFoundError):
                return {}
        return {}
        
    def create_context(self, project_name: str, model_name: str = "qwen2.5-coder-3b-instruct:4") -> MCPContext:
        """Create new MCP context for a project"""
        context = MCPContext(
            project_name=project_name,
            model_name=model_name,
            conversation_history=[],
            session_data={},
            created_at=datetime.now(),
            last_updated=datetime.now()
        )
        self.contexts[project_name] = context
        return context
        
    def switch_context(self, project_name: str) -> bool:
        """Switch to a different project context"""
        if project_name in self.contexts:
            self.current_context = self.contexts[project_name]
            return True
        else:
            self.current_context = self.create_context(project_name)
            return True
            
    def query_lm_studio_with_context(self, prompt: str, context_name: str = None) -> str:
        """Query LM Studio with MCP context management"""
        if context_name:
            self.switch_context(context_name)
            
        if not self.current_context:
            self.current_context = self.create_context("default")
            
        try:
            response = requests.post(
                f"{self.lm_studio_url}/v1/chat/completions",
                json={
                    "model": self.current_context.model_name,
                    "messages": [
                        {"role": "system", "content": f"Project: {self.current_context.project_name}"},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000
                },
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content']
            else:
                return f"Error: {response.status_code}"
                
        except requests.exceptions.RequestException as e:
            return f"Connection error: {str(e)}"
            
    def _create_default_memory(self) -> Dict[str, Any]:
        return {
            "tasks_completed": [],
            "project_analysis": {},
            "mcp_contexts": [],
            "last_updated": datetime.now().isoformat()
        }

def main():
    agent = MCPEnhancedDevelopmentAgent()
    print("🚀 MCP Enhanced Development Agent Started!")
    agent.switch_context("morocco-transport")
    response = agent.query_lm_studio_with_context("Analyze project and suggest improvements")
    print(f"Response: {response}")

if __name__ == "__main__":
    main()#!/usr/bin/env python3
import os
import json
import requests
import time
import re
from typing import Dict, List, Tuple, Optional

# Configuration
PROJECT_PATH = os.path.expanduser("~/Projects/llm-mcp/autogen")
MEMORY_FILE = "enhanced_memory.json"
ALLOWED_EXTENSIONS = ('.py', '.md', '.txt', '.json', '.yaml', '.yml', '.toml', '.cfg', '.ini', '.rst')
LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions"

class EnhancedLLMAgent:
    def __init__(self):
        self.memory = self.load_memory()
        self.session = requests.Session()
        self.session.timeout = 60
        
    def load_memory(self) -> Dict:
        """Load memory from JSON file"""
        if not os.path.exists(MEMORY_FILE):
            return {"completed": [], "history": [], "current_task": None, "project_analysis": {}}
        try:
            with open(MEMORY_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load memory: {e}")
            return {"completed": [], "history": [], "current_task": None, "project_analysis": {}}
    
    def save_memory(self) -> None:
        """Save memory to JSON file"""
        try:
            with open(MEMORY_FILE, 'w') as f:
                json.dump(self.memory, f, indent=2)
        except Exception as e:
            print(f"Warning: Could not save memory: {e}")
    
    def test_lm_studio_connection(self) -> bool:
        """Test if LM Studio is accessible"""
        try:
            response = self.session.get("http://localhost:1234/v1/models", timeout=5)
            if response.status_code == 200:
                models = response.json()
                print(f"✅ LM Studio connected. Available models: {len(models.get('data', []))}")
                return True
            else:
                print(f"❌ LM Studio responded with status {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Cannot connect to LM Studio: {e}")
            return False
    
    def get_project_structure(self, folder: str, max_depth: int = 3) -> str:
        """Get a high-level overview of project structure"""
        structure = []
        
        def scan_directory(path: str, current_depth: int = 0, prefix: str = ""):
            if current_depth > max_depth:
                return
                
            try:
                items = sorted(os.listdir(path))
                for item in items:
                    if item.startswith('.') and item not in ['.github', '.gitignore']:
                        continue
                    
                    item_path = os.path.join(path, item)
                    if os.path.isdir(item_path):
                        if item in ['__pycache__', 'node_modules', '.pytest_cache', 'venv', 'env', '.git']:
                            continue
                        structure.append(f"{prefix}📁 {item}/")
                        if current_depth < max_depth:
                            scan_directory(item_path, current_depth + 1, prefix + "  ")
                    else:
                        if item.endswith(('.py', '.md', '.txt', '.json', '.yaml', '.yml', '.toml')):
                            structure.append(f"{prefix}📄 {item}")
            except PermissionError:
                structure.append(f"{prefix}❌ Permission denied")
        
        scan_directory(folder)
        return "\n".join(structure[:50])  # Limit output
    
    def read_key_files(self, folder: str) -> str:
        """Read important project files"""
        key_files = ['README.md', 'setup.py', 'pyproject.toml', 'requirements.txt', '__init__.py']
        content = ""
        
        for root, dirs, files in os.walk(folder):
            # Skip deep nested directories
            level = root.replace(folder, '').count(os.sep)
            if level > 2:
                continue
                
            dirs[:] = [d for d in dirs if d not in ['.git', '__pycache__', 'node_modules', '.pytest_cache']]
            
            for file in files:
                if file in key_files or (file.endswith(('.py', '.md')) and len(content) < 8000):
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, folder)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            file_content = f.read()
                            if len(file_content) > 1000:
                                file_content = file_content[:1000] + "\n... [truncated]"
                            
                            content += f"\n\n=== {rel_path} ===\n{file_content}\n"
                            
                            if len(content) > 8000:
                                content += "\n\n... [More files truncated for token limit]"
                                return content
                    except Exception as e:
                        content += f"\n\n=== {rel_path} ===\n[Error reading: {e}]\n"
        
        return content
    
    def ask_qwen_simple(self, prompt: str) -> str:
        """Simple request to Qwen with better error handling"""
        print("🧠 Asking Qwen...")
        
        payload = {
            "model": "qwen2.5-coder-3b-instruct",
            "messages": [
                {"role": "system", "content": "You are a helpful coding assistant. Be concise and practical."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 1500,
            "stream": False
        }
        
        try:
            response = self.session.post(LM_STUDIO_URL, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            if 'choices' in result and len(result['choices']) > 0:
                return result['choices'][0]['message']['content'].strip()
            else:
                return "Error: No response from model"
                
        except requests.exceptions.Timeout:
            return "Error: Request timed out"
        except requests.exceptions.ConnectionError:
            return "Error: Cannot connect to LM Studio"
        except Exception as e:
            return f"Error: {str(e)}"
    
    def analyze_project(self) -> str:
        """Analyze the AutoGen project"""
        print(f"📊 Analyzing project at {PROJECT_PATH}")
        
        if not os.path.exists(PROJECT_PATH):
            return "Error: Project path does not exist"
        
        # Get project structure
        structure = self.get_project_structure(PROJECT_PATH)
        
        # Read key files
        key_content = self.read_key_files(PROJECT_PATH)
        
        # Create analysis prompt
        prompt = f"""Analyze this Python project structure and key files:

PROJECT STRUCTURE:
{structure}

KEY FILES CONTENT:
{key_content}

Provide a brief analysis covering:
1. What this project does
2. Main components/modules
3. Key areas that could be improved
4. Suggestions for next development steps

Keep response under 500 words."""
        
        return self.ask_qwen_simple(prompt)
    
    def suggest_improvements(self, analysis: str) -> str:
        """Get specific improvement suggestions"""
        prompt = f"""Based on this project analysis:

{analysis}

Provide 3-5 specific, actionable improvement suggestions. Format as:

1. [Improvement area]: [Specific action]
2. [Improvement area]: [Specific action]
...

Focus on practical changes that would make the project better."""
        
        return self.ask_qwen_simple(prompt)
    
    def run_analysis(self) -> None:
        """Run complete project analysis"""
        print("🚀 Enhanced LLM Agent - Project Analysis Mode")
        print(f"📁 Target: {PROJECT_PATH}\n")
        
        # Test connection first
        if not self.test_lm_studio_connection():
            print("❌ Cannot proceed without LM Studio connection")
            return
        
        # Run analysis
        print("\n📊 Running project analysis...")
        analysis = self.analyze_project()
        
        print("\n" + "="*60)
        print("📋 PROJECT ANALYSIS")
        print("="*60)
        print(analysis)
        
        # Get improvement suggestions
        print("\n📈 Getting improvement suggestions...")
        improvements = self.suggest_improvements(analysis)
        
        print("\n" + "="*60)
        print("💡 IMPROVEMENT SUGGESTIONS")
        print("="*60)
        print(improvements)
        
        # Save to memory
        self.memory['project_analysis'] = {
            "timestamp": time.time(),
            "analysis": analysis,
            "improvements": improvements
        }
        self.memory['completed'].append("Project analysis completed")
        self.save_memory()
        
        print("\n✅ Analysis complete! Results saved to memory.")
    
    def interactive_mode(self) -> None:
        """Interactive mode for custom tasks"""
        print("🎯 Interactive mode - Type 'analyze' for project analysis or custom prompts")
        
        while True:
            try:
                user_input = input("\n> ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    break
                elif user_input.lower() == 'analyze':
                    self.run_analysis()
                elif user_input.lower() == 'status':
                    print(f"Completed tasks: {len(self.memory['completed'])}")
                    if self.memory['completed']:
                        for task in self.memory['completed'][-3:]:
                            print(f"  - {task}")
                elif user_input:
                    response = self.ask_qwen_simple(user_input)
                    print(f"\n🤖 Qwen: {response}")
                    
            except KeyboardInterrupt:
                break
        
        print("\n👋 Goodbye!")

if __name__ == "__main__":
    agent = EnhancedLLMAgent()
    
    # Run analysis by default
    agent.run_analysis()
    
    # Then enter interactive mode
    print("\n" + "="*60)
    agent.interactive_mode()
