import sys
import json
import subprocess
import os
from typing import Dict, List, Optional

class SystemVerifier:
    def __init__(self):
        self.issues: List[str] = []
        self.warnings: List[str] = []
        
    def check_node_version(self) -> bool:
        """Verify Node.js version"""
        try:
            # Run node -v and strip the 'v' prefix
            result = subprocess.run(['node', '-v'], capture_output=True, text=True)
            version = result.stdout.strip().lstrip('v')
            required = "18.19.0"
            
            if version != required:
                self.issues.append(f"Node.js version mismatch: found {version}, required {required}")
                return False
            return True
        except Exception as e:
            self.issues.append(f"Failed to check Node.js version: {str(e)}")
            return False

    def check_npm_version(self) -> bool:
        """Verify npm version"""
        try:
            result = subprocess.run(['npm', '-v'], capture_output=True, text=True)
            version = result.stdout.strip()
            required = "10.2.3"
            
            if version != required:
                self.issues.append(f"npm version mismatch: found {version}, required {required}")
                return False
            return True
        except Exception as e:
            self.issues.append(f"Failed to check npm version: {str(e)}")
            return False

    def check_python_version(self) -> bool:
        """Verify Python version"""
        required = "3.11.0"
        version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
        
        if version != required:
            self.issues.append(f"Python version mismatch: found {version}, required {required}")
            return False
        return True

    def check_package_versions(self, package_path: str, required_versions: Dict[str, str]) -> bool:
        """Verify package.json dependency versions"""
        try:
            with open(package_path, 'r') as f:
                package_data = json.load(f)
            
            all_correct = True
            dependencies = {
                **package_data.get('dependencies', {}),
                **package_data.get('devDependencies', {})
            }
            
            for pkg, required_version in required_versions.items():
                if pkg in dependencies:
                    found_version = dependencies[pkg].lstrip('^~')
                    if found_version != required_version:
                        self.issues.append(
                            f"Package version mismatch in {package_path}: "
                            f"{pkg} found {found_version}, required {required_version}"
                        )
                        all_correct = False
                else:
                    self.warnings.append(f"Package not found: {pkg} in {package_path}")
                    all_correct = False
            
            return all_correct
        except Exception as e:
            self.issues.append(f"Failed to check package versions in {package_path}: {str(e)}")
            return False

    def check_env_file(self) -> bool:
        """Verify .env file exists and has required variables"""
        required_vars = [
            'NOTION_API_KEY',
            'NOTION_TASKS_DATABASE_ID'
        ]
        
        if not os.path.exists('.env'):
            self.issues.append(".env file not found")
            return False
        
        with open('.env', 'r') as f:
            env_content = f.read()
        
        all_present = True
        for var in required_vars:
            if var not in env_content:
                self.issues.append(f"Missing environment variable: {var}")
                all_present = False
        
        return all_present

    def check_git_configuration(self) -> bool:
        """Verify git configuration is correct"""
        try:
            # Check .gitignore includes sensitive files
            gitignore_required = [
                '.env',
                'node_modules/',
                'dist/',
                '__pycache__/',
                '*.pyc',
                '.vscode/'
            ]
            
            if not os.path.exists('.gitignore'):
                self.issues.append(".gitignore file not found")
                return False
                
            with open('.gitignore', 'r') as f:
                gitignore_content = f.read()
                
            for item in gitignore_required:
                if item not in gitignore_content:
                    self.issues.append(f"Missing from .gitignore: {item}")
                    return False
            
            return True
        except Exception as e:
            self.issues.append(f"Failed to check git configuration: {str(e)}")
            return False
            
    def check_editor_config(self) -> bool:
        """Verify editor configuration for consistent formatting"""
        if not os.path.exists('.editorconfig'):
            self.warnings.append(".editorconfig not found - recommended for consistent formatting")
            return False
        return True
    
    def check_typescript_config(self) -> bool:
        """Verify TypeScript configuration"""
        required_files = ['tsconfig.json', 'tsconfig.node.json']
        
        for file in required_files:
            if not os.path.exists(file):
                self.issues.append(f"Missing TypeScript config: {file}")
                return False
        
        return True
        
    def check_vscode_settings(self) -> bool:
        """Verify VS Code settings for consistent development"""
        if not os.path.exists('.vscode/settings.json'):
            self.warnings.append("VS Code settings not found - recommended for consistent development")
            return False
        return True

    def run_all_checks(self) -> bool:
        """Run all system verification checks"""
        print("Starting system verification...")
        
        checks = [
            (self.check_node_version, "Node.js version"),
            (self.check_npm_version, "npm version"),
            (self.check_python_version, "Python version"),
            (self.check_env_file, "Environment configuration"),
            (self.check_git_configuration, "Git configuration"),
            (self.check_editor_config, "Editor configuration"),
            (self.check_typescript_config, "TypeScript configuration"),
            (self.check_vscode_settings, "VS Code settings")
        ]
        
        frontend_versions = {
            "@notionhq/client": "2.2.14",
            "@tanstack/react-query": "5.17.19",
            "react": "18.2.0"
        }
        
        backend_versions = {
            "express": "4.18.2",
            "cors": "2.8.5",
            "dotenv": "16.4.1"
        }
        
        # Add package.json checks if files exist
        if os.path.exists('package.json'):
            checks.append((
                lambda: self.check_package_versions('package.json', frontend_versions),
                "Frontend dependencies"
            ))
        
        if os.path.exists('backend/package.json'):
            checks.append((
                lambda: self.check_package_versions('backend/package.json', backend_versions),
                "Backend dependencies"
            ))
        
        all_passed = True
        for check_func, name in checks:
            try:
                print(f"\nChecking {name}...")
                if check_func():
                    print(f"✓ {name} check passed")
                else:
                    print(f"✗ {name} check failed")
                    all_passed = False
            except Exception as e:
                print(f"✗ {name} check error: {str(e)}")
                all_passed = False
        
        print("\nVerification Summary:")
        if self.issues:
            print("\nIssues found:")
            for issue in self.issues:
                print(f"  - {issue}")
        
        if self.warnings:
            print("\nWarnings:")
            for warning in self.warnings:
                print(f"  - {warning}")
        
        if all_passed:
            print("\n✓ All checks passed successfully!")
        else:
            print("\n✗ Some checks failed. Please review issues above.")
        
        return all_passed

if __name__ == "__main__":
    verifier = SystemVerifier()
    success = verifier.run_all_checks()
    sys.exit(0 if success else 1)