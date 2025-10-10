# Phase 1 Commands - Backend Setup

## Phase 1.1: Create Virtual Environment and Install Python Dependencies

### Step 1: Navigate to Backend Directory
```bash
cd healthcare-document-processor/backend
```

### Step 2: Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Activate virtual environment (Linux/Mac)
# source venv/bin/activate
```

### Step 3: Upgrade pip and Install Core Dependencies
```bash
# Upgrade pip to latest version
python -m pip install --upgrade pip

# Install core FastAPI dependencies
pip install fastapi[all] uvicorn[standard]

# Install database dependencies
pip install sqlalchemy psycopg2-binary alembic

# Install authentication and security
pip install python-jose[cryptography] passlib[bcrypt] python-multipart

# Install AI/ML dependencies
pip install langchain openai chromadb pinecone-client

# Install OCR dependencies
pip install pytesseract pillow pdf2image

# Install file processing
pip install python-magic-bin boto3

# Install background tasks
pip install celery redis

# Install development dependencies
pip install pytest pytest-asyncio httpx black flake8

# Install environment management
pip install python-dotenv
```

### Step 4: Create requirements.txt
```bash
# Generate requirements.txt from installed packages
pip freeze > requirements.txt
```

## Phase 1.2: Initialize FastAPI Project Structure

### Step 1: Create Main Application Files
```bash
# Create main FastAPI app file
touch main.py

# Create configuration file
touch config.py

# Create database configuration
touch database.py
```

### Step 2: Create Directory Structure
```bash
# Create API directory structure
mkdir app
mkdir app\api
mkdir app\core
mkdir app\models
mkdir app\services
mkdir app\utils

# Create additional directories
mkdir tests
mkdir alembic
mkdir logs
```

### Step 3: Create Initial Files in Each Directory
```bash
# API layer files
touch app\api\__init__.py
touch app\api\auth.py
touch app\api\documents.py
touch app\api\analysis.py
touch app\api\users.py

# Core files
touch app\core\__init__.py
touch app\core\config.py
touch app\core\security.py
touch app\core\database.py

# Models
touch app\models\__init__.py
touch app\models\user.py
touch app\models\document.py
touch app\models\analysis.py
touch app\models\chunk.py

# Services
touch app\services\__init__.py
touch app\services\auth_service.py
touch app\services\document_service.py
touch app\services\ocr_service.py
touch app\services\rag_service.py
touch app\services\ai_service.py
touch app\services\s3_service.py

# Utils
touch app\utils\__init__.py
touch app\utils\helpers.py
touch app\utils\validators.py

# Test files
touch tests\__init__.py
touch tests\test_auth.py
touch tests\test_documents.py
touch tests\test_analysis.py
```

### Step 4: Create Environment Configuration
```bash
# Create .env file for environment variables
touch .env

# Create .env.example file
touch .env.example
```

### Step 5: Create Docker Files
```bash
# Create Dockerfile
touch Dockerfile

# Create docker-compose file
touch docker-compose.yml

# Create .dockerignore
touch .dockerignore
```

### Step 6: Create Project Documentation
```bash
# Create README
touch README.md

# Create .gitignore
touch .gitignore
```

## Verification Commands

### Check if everything is set up correctly:
```bash
# Check Python version
python --version

# Check if virtual environment is activated (should show venv path)
where python

# Check installed packages
pip list

# Test FastAPI installation
python -c "import fastapi; print('FastAPI installed successfully')"

# Test other key imports
python -c "import sqlalchemy, uvicorn, langchain; print('All core dependencies imported successfully')"
```

## Next Steps After Phase 1.1 and 1.2:

1. **Configure environment variables** in `.env` file
2. **Set up database configuration** in `app/core/database.py`
3. **Create basic FastAPI app** in `main.py`
4. **Move to Phase 1.3** - Database configuration

## Important Notes:

- **Virtual Environment**: Always activate `venv` before working on the project
- **Dependencies**: Some packages like `python-magic-bin` are Windows-specific; use `python-magic` on Linux/Mac
- **OCR Setup**: You'll need to install Tesseract OCR separately on your system
- **Database**: You'll need PostgreSQL running locally or use a cloud instance

Would you like me to show you the commands for **Phase 1.3** (Database Configuration) next, or do you want to run these commands first and let me know if you encounter any issues?
