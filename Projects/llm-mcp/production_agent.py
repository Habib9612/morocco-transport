#!/usr/bin/env python3
"""
Production-Ready LLM Development Agent with Advanced MCP Integration
Combines all enhanced features for autonomous development
"""

import os
import sys
import json
import time
import requests
from typing import Dict, List, Optional, Any
from pathlib import Path
from dataclasses import dataclass, asdict
from advanced_mcp_tools import AdvancedMCPTools, PerformanceMetrics

@dataclass
class AgentConfig:
    """Configuration for the production agent"""
    lm_studio_url: str = 'http://localhost:1234'
    project_root: str = '/Users/baigalahbib/Projects/llm-mcp'
    memory_file: str = 'production_memory.json'
    max_retries: int = 3
    retry_delay: float = 1.0
    performance_logging: bool = True
    auto_git_operations: bool = True

class ProductionAgent:
    """Production-ready development agent with full MCP integration"""
    
    def __init__(self, config: AgentConfig = None):
        self.config = config or AgentConfig()
        self.project_root = Path(self.config.project_root)
        self.memory_file = self.project_root / self.config.memory_file
        self.advanced_tools = AdvancedMCPTools(self.config.project_root)
        self.memory = self._load_memory()
        self.session_id = f'session_{int(time.time())}'
        
    def _load_memory(self) -> Dict[str, Any]:
        """Load agent memory with error handling"""
        try:
            if self.memory_file.exists():
                with open(self.memory_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return {
                'contexts': {},
                'completed_tasks': [],
                'performance_history': [],
                'git_operations': [],
                'last_updated': time.time()
            }
        except Exception as e:
            print(f'Warning: Could not load memory: {e}')
            return {'contexts': {}, 'completed_tasks': [], 'error': str(e)}
    
    def _save_memory(self):
        """Save agent memory with backup"""
        try:
            # Create backup
            if self.memory_file.exists():
                backup_file = self.memory_file.with_suffix('.json.backup')
                self.memory_file.rename(backup_file)
                
            self.memory['last_updated'] = time.time()
            with open(self.memory_file, 'w', encoding='utf-8') as f:
                json.dump(self.memory, f, indent=2, default=str)
                
        except Exception as e:
            print(f'Warning: Could not save memory: {e}')
    
    def _query_lm_studio(self, prompt: str, context: str = None, 
                        max_retries: int = None) -> Optional[str]:
        """Query LM Studio with robust error handling and retries"""
        max_retries = max_retries or self.config.max_retries
        
        for attempt in range(max_retries):
            try:
                full_prompt = f'{context}\n\n{prompt}' if context else prompt
                
                payload = {
                    'model': 'qwen2.5-coder-3b-instruct',
                    'messages': [
                        {'role': 'system', 'content': 'You are an expert development assistant.'},
                        {'role': 'user', 'content': full_prompt}
                    ],
                    'temperature': 0.1,
                    'max_tokens': 2000
                }
                
                response = requests.post(
                    f'{self.config.lm_studio_url}/v1/chat/completions',
                    json=payload,
                    timeout=30
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data['choices'][0]['message']['content']
                else:
                    print(f'LM Studio error (attempt {attempt + 1}): {response.status_code}')
                    
            except requests.exceptions.RequestException as e:
                print(f'Connection error (attempt {attempt + 1}): {e}')
                
            if attempt < max_retries - 1:
                time.sleep(self.config.retry_delay * (attempt + 1))
                
        print(f'Failed to connect to LM Studio after {max_retries} attempts')
        return None
    
    def analyze_project_comprehensive(self, project_path: str = None) -> Dict[str, Any]:
        """Comprehensive project analysis using all available tools"""
        start_time = time.time()
        project_path = project_path or str(self.project_root)
        
        analysis = {
            'project_path': project_path,
            'timestamp': time.time(),
            'session_id': self.session_id
        }
        
        try:
            # File structure analysis
            analysis['file_structure'] = self._analyze_file_structure(project_path)
            
            # Dependency analysis
            analysis['dependencies'] = self.advanced_tools.analyze_dependencies()
            
            # Git status and branch analysis
            analysis['git_status'] = self.advanced_tools.manage_git_branches('list')
            
            # Performance metrics
            analysis['performance'] = self.advanced_tools.get_performance_report()
            
            # Code quality analysis for Python files
            python_files = list(Path(project_path).glob('*.py'))[:5]  # Limit to 5 files
            analysis['code_quality'] = []
            
            for py_file in python_files:
                relative_path = str(py_file.relative_to(project_path))
                quality_analysis = self.advanced_tools.suggest_code_refactoring(relative_path)
                analysis['code_quality'].append(quality_analysis)
            
            # LM Studio analysis
            context = f"""Project Analysis Context:
Project: {project_path}
Files analyzed: {len(analysis['file_structure'])}
Dependencies: {len(analysis['dependencies'].get('dependencies', {}))}
Python files: {len(python_files)}"""
            
            prompt = """Based on this project analysis, provide:
1. Overall project health assessment
2. Recommended improvements
3. Potential issues to address
4. Development priorities

Provide specific, actionable recommendations."""
            
            llm_analysis = self._query_lm_studio(prompt, context)
            analysis['llm_recommendations'] = llm_analysis
            
            # Save to memory
            self.memory['completed_tasks'].append({
                'task': 'comprehensive_project_analysis',
                'timestamp': time.time(),
                'duration': time.time() - start_time,
                'project_path': project_path,
                'files_analyzed': len(analysis['file_structure'])
            })
            
            self._save_memory()
            return analysis
            
        except Exception as e:
            analysis['error'] = str(e)
            return analysis
    
    def _analyze_file_structure(self, project_path: str) -> List[Dict[str, Any]]:
        """Analyze project file structure"""
        files = []
        project_root = Path(project_path)
        
        for file_path in project_root.rglob('*'):
            if file_path.is_file() and not any(part.startswith('.') for part in file_path.parts):
                try:
                    stat = file_path.stat()
                    files.append({
                        'path': str(file_path.relative_to(project_root)),
                        'size': stat.st_size,
                        'modified': stat.st_mtime,
                        'extension': file_path.suffix
                    })
                except (OSError, ValueError):
                    continue
                    
        return files
    
    def auto_improve_codebase(self, target_files: List[str] = None) -> Dict[str, Any]:
        """Automatically improve codebase using LM Studio suggestions"""
        start_time = time.time()
        improvements = {
            'session_id': self.session_id,
            'timestamp': time.time(),
            'improvements_made': [],
            'errors': []
        }
        
        try:
            if not target_files:
                # Find Python files to improve
                target_files = [str(f.relative_to(self.project_root)) 
                              for f in self.project_root.glob('*.py')][:3]
            
            for file_path in target_files:
                try:
                    # Analyze current code
                    analysis = self.advanced_tools.suggest_code_refactoring(file_path)
                    
                    if 'error' not in analysis and analysis['suggestions']:
                        # Get LM Studio improvement suggestions
                        context = f"""File: {file_path}
Current issues found: {len(analysis['suggestions'])}
Suggestions: {json.dumps(analysis['suggestions'], indent=2)}"""
                        
                        prompt = f"""Please provide improved code for {file_path} that addresses these issues:
1. Fix long lines
2. Address TODO/FIXME items
3. Reduce code duplication
4. Improve overall code quality

Provide the complete improved code with explanations."""
                        
                        improved_code = self._query_lm_studio(prompt, context)
                        
                        if improved_code:
                            improvements['improvements_made'].append({
                                'file': file_path,
                                'original_issues': len(analysis['suggestions']),
                                'improvement_suggestion': improved_code[:500] + '...',
                                'timestamp': time.time()
                            })
                            
                except Exception as e:
                    improvements['errors'].append({
                        'file': file_path,
                        'error': str(e)
                    })
            
            # Update memory
            self.memory['completed_tasks'].append({
                'task': 'auto_improve_codebase',
                'timestamp': time.time(),
                'duration': time.time() - start_time,
                'files_processed': len(target_files),
                'improvements_made': len(improvements['improvements_made'])
            })
            
            self._save_memory()
            return improvements
            
        except Exception as e:
            improvements['error'] = str(e)
            return improvements
    
    def interactive_development_session(self):
        """Start an interactive development session"""
        print(f'\n🚀 Production Agent Interactive Session Started')
        print(f'Session ID: {self.session_id}')
        print(f'Project: {self.project_root}')
        print(f'LM Studio: {self.config.lm_studio_url}')
        print('\nAvailable commands:')
        print('  analyze - Comprehensive project analysis')
        print('  improve - Auto-improve codebase')
        print('  git <action> [branch] - Git operations')
        print('  diff <file> - Analyze file differences')
        print('  deps - Analyze dependencies')
        print('  performance - Show performance report')
        print('  memory - Show agent memory')
        print('  quit - Exit session')
        
        while True:
            try:
                command = input('\n🤖 Agent> ').strip().lower()
                
                if command == 'quit':
                    break
                elif command == 'analyze':
                    print('\n📊 Running comprehensive analysis...')
                    result = self.analyze_project_comprehensive()
                    print(json.dumps(result, indent=2, default=str))
                elif command == 'improve':
                    print('\n🔧 Auto-improving codebase...')
                    result = self.auto_improve_codebase()
                    print(json.dumps(result, indent=2, default=str))
                elif command.startswith('git '):
                    parts = command.split()
                    action = parts[1] if len(parts) > 1 else 'list'
                    branch = parts[2] if len(parts) > 2 else None
                    result = self.advanced_tools.manage_git_branches(action, branch)
                    print(json.dumps(result, indent=2))
                elif command.startswith('diff '):
                    file_path = command.split(' ', 1)[1]
                    result = self.advanced_tools.analyze_file_diff(file_path)
                    print(json.dumps(result, indent=2))
                elif command == 'deps':
                    result = self.advanced_tools.analyze_dependencies()
                    print(json.dumps(result, indent=2))
                elif command == 'performance':
                    result = self.advanced_tools.get_performance_report()
                    print(json.dumps(result, indent=2))
                elif command == 'memory':
                    print(json.dumps(self.memory, indent=2, default=str))
                else:
                    print(f'Unknown command: {command}')
                    
            except KeyboardInterrupt:
                break
            except Exception as e:
                print(f'Error: {e}')
        
        print('\n👋 Session ended. Memory saved.')
        self._save_memory()

def main():
    """Main entry point for production agent"""
    config = AgentConfig()
    agent = ProductionAgent(config)
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == 'analyze':
            result = agent.analyze_project_comprehensive()
            print(json.dumps(result, indent=2, default=str))
        elif command == 'improve':
            result = agent.auto_improve_codebase()
            print(json.dumps(result, indent=2, default=str))
        elif command == 'interactive':
            agent.interactive_development_session()
        else:
            print(f'Unknown command: {command}')
            print('Available commands: analyze, improve, interactive')
    else:
        # Default to interactive mode
        agent.interactive_development_session()

if __name__ == '__main__':
    main()
