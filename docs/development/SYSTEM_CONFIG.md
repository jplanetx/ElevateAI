# System Configuration

## Version Requirements
```json
{
  "node": "18.19.0",
  "npm": "10.2.3",
  "python": "3.11.0"
}
```

## Core Dependencies
```json
{
  "frontend": {
    "@notionhq/client": "2.2.14",
    "@tanstack/react-query": "5.17.19",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.3.3",
    "vite": "5.0.12"
  },
  "backend": {
    "express": "4.18.2",
    "cors": "2.8.5",
    "dotenv": "16.4.1"
  }
}
```

## Environment Configuration
- Node version managed by .nvmrc
- Python virtual environment required
- Environment variables in .env

## Verification Commands
```bash
# Node version check
node -v  # Should be 18.19.0
npm -v   # Should be 10.2.3

# Python version check
python --version  # Should be 3.11.0

# Environment setup
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

## Required Configuration Files
- package.json (frontend & backend)
- tsconfig.json
- vite.config.ts
- .env
- .nvmrc
- requirements.txt

## System Requirements Check
Run before starting any development:
1. Check Node.js version
2. Verify Python version
3. Validate environment variables
4. Confirm dependencies match versions