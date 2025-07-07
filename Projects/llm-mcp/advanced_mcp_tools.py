#!/usr/bin/env python3
"""
Advanced MCP Tools for Enhanced Development Agent
Provides additional tools for file operations, git management, and code analysis
"""

import os
import json
import subprocess
import time
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from pathlib import Path

@dataclass
class PerformanceMetrics:
    """Track performance metrics for agent operations"""
    operation: str
    start_time: float
    end_time: float
    memory_usage: float
    file_count: int
    success: bool
    
    @property
    def duration(self) -> float:
        return self.end_time - self.start_time

class AdvancedMCPTools:
    """Advanced MCP tools for enhanced development capabilities"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.performance_log = []
        self.max_file_size = 10 * 1024 * 1024  # 10MB limit
        
    def _log_performance(self, operation: str, start_time: float, 
                        file_count: int = 0, success: bool = True):
        """Log performance metrics for operations"""
        import psutil
        process = psutil.Process()
        memory_usage = process.memory_info().rss / 1024 / 1024  # MB
        
        metric = PerformanceMetrics(
            operation=operation,
            start_time=start_time,
            end_time=time.time(),
            memory_usage=memory_usage,
            file_count=file_count,
            success=success
        )
        self.performance_log.append(metric)
        return metric
    
    def analyze_file_diff(self, file_path: str, branch1: str = 'HEAD', 
                         branch2: str = 'main') -> Dict[str, Any]:
        """Analyze differences between file versions"""
        start_time = time.time()
        try:
            cmd = f'git diff {branch1}..{branch2} -- {file_path}'
            result = subprocess.run(cmd, shell=True, capture_output=True, 
                                  text=True, cwd=self.project_root)
            
            if result.returncode == 0:
                diff_lines = result.stdout.split('\n')
                additions = len([l for l in diff_lines if l.startswith('+')])
                deletions = len([l for l in diff_lines if l.startswith('-')])
                
                analysis = {
                    'file_path': file_path,
                    'additions': additions,
                    'deletions': deletions,
                    'total_changes': additions + deletions,
                    'diff_content': result.stdout,
                    'branches_compared': f'{branch1}..{branch2}'
                }
                
                self._log_performance('file_diff_analysis', start_time, 1, True)
                return analysis
            else:
                raise Exception(f'Git diff failed: {result.stderr}')
                
        except Exception as e:
            self._log_performance('file_diff_analysis', start_time, 1, False)
            return {'error': str(e), 'file_path': file_path}
    
    def suggest_code_refactoring(self, file_path: str) -> Dict[str, Any]:
        """Analyze code and suggest refactoring improvements"""
        start_time = time.time()
        try:
            full_path = self.project_root / file_path
            if not full_path.exists():
                raise FileNotFoundError(f'File not found: {file_path}')
                
            if full_path.stat().st_size > self.max_file_size:
                raise Exception(f'File too large: {file_path}')
                
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            suggestions = []
            lines = content.split('\n')
            
            # Basic refactoring suggestions
            for i, line in enumerate(lines, 1):
                # Long line detection
                if len(line) > 120:
                    suggestions.append({
                        'type': 'long_line',
                        'line': i,
                        'message': f'Line {i} is too long ({len(line)} chars)',
                        'suggestion': 'Consider breaking into multiple lines'
                    })
                
                # TODO/FIXME detection
                if 'TODO' in line or 'FIXME' in line:
                    suggestions.append({
                        'type': 'todo_fixme',
                        'line': i,
                        'message': f'Found TODO/FIXME at line {i}',
                        'suggestion': 'Address pending work item'
                    })
                
                # Duplicate code patterns (simple detection)
                if line.strip() and lines.count(line) > 1:
                    suggestions.append({
                        'type': 'duplicate_code',
                        'line': i,
                        'message': f'Potential duplicate code at line {i}',
                        'suggestion': 'Consider extracting to a function'
                    })
            
            analysis = {
                'file_path': file_path,
                'total_lines': len(lines),
                'suggestions': suggestions,
                'suggestion_count': len(suggestions),
                'file_size': full_path.stat().st_size
            }
            
            self._log_performance('code_refactoring_analysis', start_time, 1, True)
            return analysis
            
        except Exception as e:
            self._log_performance('code_refactoring_analysis', start_time, 1, False)
            return {'error': str(e), 'file_path': file_path}
    
    def manage_git_branches(self, action: str, branch_name: str = None) -> Dict[str, Any]:
        """Advanced git branch management"""
        start_time = time.time()
        try:
            if action == 'list':
                cmd = 'git branch -a'
            elif action == 'create' and branch_name:
                cmd = f'git checkout -b {branch_name}'
            elif action == 'switch' and branch_name:
                cmd = f'git checkout {branch_name}'
            elif action == 'delete' and branch_name:
                cmd = f'git branch -d {branch_name}'
            elif action == 'merge' and branch_name:
                cmd = f'git merge {branch_name}'
            else:
                raise ValueError(f'Invalid action or missing branch_name: {action}')
                
            result = subprocess.run(cmd, shell=True, capture_output=True, 
                                  text=True, cwd=self.project_root)
            
            if result.returncode == 0:
                response = {
                    'action': action,
                    'branch_name': branch_name,
                    'output': result.stdout,
                    'success': True
                }
            else:
                response = {
                    'action': action,
                    'branch_name': branch_name,
                    'error': result.stderr,
                    'success': False
                }
                
            self._log_performance('git_branch_management', start_time, 0, result.returncode == 0)
            return response
            
        except Exception as e:
            self._log_performance('git_branch_management', start_time, 0, False)
            return {'error': str(e), 'action': action, 'branch_name': branch_name}
    
    def analyze_dependencies(self, file_types: List[str] = None) -> Dict[str, Any]:
        """Analyze project dependencies and suggest optimizations"""
        start_time = time.time()
        if file_types is None:
            file_types = ['requirements.txt', 'package.json', 'Pipfile', 'pyproject.toml']
            
        try:
            dependencies = {}
            file_count = 0
            
            for file_type in file_types:
                dep_file = self.project_root / file_type
                if dep_file.exists():
                    file_count += 1
                    with open(dep_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    if file_type == 'requirements.txt':
                        deps = [line.strip() for line in content.split('\n') 
                               if line.strip() and not line.startswith('#')]
                        dependencies['python'] = deps
                    elif file_type == 'package.json':
                        try:
                            pkg_data = json.loads(content)
                            dependencies['node'] = {
                                'dependencies': pkg_data.get('dependencies', {}),
                                'devDependencies': pkg_data.get('devDependencies', {})
                            }
                        except json.JSONDecodeError:
                            dependencies['node'] = {'error': 'Invalid JSON'}
            
            analysis = {
                'project_root': str(self.project_root),
                'dependencies': dependencies,
                'files_analyzed': file_count,
                'suggestions': []
            }
            
            # Add optimization suggestions
            if 'python' in dependencies:
                python_deps = dependencies['python']
                if len(python_deps) > 50:
                    analysis['suggestions'].append({
                        'type': 'dependency_optimization',
                        'message': f'Large number of Python dependencies ({len(python_deps)})',
                        'suggestion': 'Consider dependency consolidation'
                    })
            
            self._log_performance('dependency_analysis', start_time, file_count, True)
            return analysis
            
        except Exception as e:
            self._log_performance('dependency_analysis', start_time, file_count, False)
            return {'error': str(e)}
    
    def get_performance_report(self) -> Dict[str, Any]:
        """Generate performance report for all operations"""
        if not self.performance_log:
            return {'message': 'No performance data available'}
            
        total_operations = len(self.performance_log)
        successful_operations = len([m for m in self.performance_log if m.success])
        avg_duration = sum(m.duration for m in self.performance_log) / total_operations
        avg_memory = sum(m.memory_usage for m in self.performance_log) / total_operations
        
        operations_by_type = {}
        for metric in self.performance_log:
            if metric.operation not in operations_by_type:
                operations_by_type[metric.operation] = []
            operations_by_type[metric.operation].append(metric)
            
        return {
            'total_operations': total_operations,
            'successful_operations': successful_operations,
            'success_rate': successful_operations / total_operations * 100,
            'average_duration': avg_duration,
            'average_memory_usage_mb': avg_memory,
            'operations_by_type': {
                op_type: {
                    'count': len(metrics),
                    'avg_duration': sum(m.duration for m in metrics) / len(metrics),
                    'success_rate': len([m for m in metrics if m.success]) / len(metrics) * 100
                }
                for op_type, metrics in operations_by_type.items()
            }
        }

if __name__ == '__main__':
    # Test the advanced tools
    tools = AdvancedMCPTools('/Users/baigalahbib/Projects/llm-mcp')
    
    # Test dependency analysis
    deps = tools.analyze_dependencies()
    print('Dependency Analysis:', json.dumps(deps, indent=2))
    
    # Test performance report
    report = tools.get_performance_report()
    print('Performance Report:', json.dumps(report, indent=2))
