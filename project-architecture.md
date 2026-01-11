# Intelligent Document Processing System - Project Architecture

## Overview
A healthcare document processing platform that extracts and analyzes medical claims, prescriptions, and insurance documents using advanced AI technologies.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   React App     │  │  Document UI    │  │  Analytics UI   │  │
│  │   (Dashboard)   │  │  (Upload/View)  │  │   (Reports)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTPS/REST API
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Backend Layer                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   FastAPI       │  │  Authentication │  │   File Storage  │  │
│  │   (Core API)    │  │   & Authz       │  │   (AWS S3)      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Document       │  │  RAG System     │  │  ML Pipeline    │  │
│  │  Processing     │  │  (LangChain)    │  │  (Analysis)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   PostgreSQL    │  │   Vector DB     │  │   Redis Cache   │  │
│  │  (Metadata)     │  │  (Pinecone/     │  │   (Sessions)    │  │
│  │                 │  │   Chroma)       │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **React Query** for state management and API calls
- **React Router** for navigation
- **Axios** for HTTP requests

### Backend
- **FastAPI** with Python 3.11+
- **SQLAlchemy** with PostgreSQL for data persistence
- **Celery** with Redis for background tasks
- **Pydantic** for data validation
- **JWT** for authentication

### AI/ML Components
- **LangChain** for RAG implementation
- **OpenAI GPT-4** for document analysis
- **Tesseract OCR** for text extraction
- **spaCy** for NLP preprocessing
- **Pinecone/Chroma** for vector storage

### Infrastructure
- **AWS S3** for document storage
- **Docker** for containerization
- **Nginx** for reverse proxy
- **PostgreSQL** for relational data
- **Redis** for caching and task queue

## Database Schema

### Core Tables

#### users
```sql
- id (UUID, Primary Key)
- email (String, Unique)
- password_hash (String)
- full_name (String)
- role (Enum: admin, user, viewer)
- created_at (Timestamp)
- updated_at (Timestamp)
- is_active (Boolean)
```

#### documents
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- filename (String)
- file_path (String) -- S3 path
- file_size (Integer)
- mime_type (String)
- document_type (Enum: claim, prescription, insurance)
- status (Enum: uploaded, processing, completed, failed)
- upload_date (Timestamp)
- processing_date (Timestamp)
- metadata (JSONB)
```

#### document_analyses
```sql
- id (UUID, Primary Key)
- document_id (UUID, Foreign Key)
- analysis_type (String)
- extracted_data (JSONB)
- confidence_scores (JSONB)
- processing_time (Float)
- created_at (Timestamp)
```

#### document_chunks
```sql
- id (UUID, Primary Key)
- document_id (UUID, Foreign Key)
- chunk_index (Integer)
- content (Text)
- embedding_id (String) -- Vector DB reference
- metadata (JSONB)
- created_at (Timestamp)
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

### Documents
- `POST /documents/upload` - Upload document
- `GET /documents` - List user documents
- `GET /documents/{id}` - Get document details
- `GET /documents/{id}/analysis` - Get document analysis
- `DELETE /documents/{id}` - Delete document

### Analysis
- `POST /analysis/process/{document_id}` - Process document
- `GET /analysis/search` - Search documents using RAG
- `GET /analysis/summary` - Get processing summary

## File Structure

```
healthcare-document-processor/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   └── requirements.txt
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## Key Features

1. **Document Upload & Processing**
   - Drag-and-drop interface
   - Multiple file format support (PDF, images, scanned documents)
   - Real-time processing status updates

2. **OCR & Text Extraction**
   - Advanced OCR with Tesseract
   - Preprocessing for better accuracy
   - Support for handwritten text

3. **RAG Implementation**
   - Document chunking and embedding
   - Vector similarity search
   - Context-aware information retrieval

4. **Document Analysis**
   - Medical claim extraction
   - Prescription parsing
   - Insurance document analysis
   - Confidence scoring

5. **Security & Compliance**
   - HIPAA compliance considerations
   - Data encryption at rest and in transit
   - Role-based access control
   - Audit logging

## Deployment Architecture

### Development Environment
- Docker Compose for local development
- Hot reload for both frontend and backend
- Local PostgreSQL and Redis instances

### Production Environment
- AWS ECS/Fargate for container orchestration
- AWS RDS for PostgreSQL
- AWS ElastiCache for Redis
- AWS S3 for document storage
- CloudFront for CDN
- Application Load Balancer for traffic distribution

## Backend Setup and Installation Guide

### Prerequisites

Before setting up the backend, ensure you have the following installed:

1. **Python 3.11+** - [Download Python](https://www.python.org/downloads/)
2. **PostgreSQL 14+** - [Download PostgreSQL](https://www.postgresql.org/download/)
3. **Redis** (optional, for background tasks) - [Download Redis](https://redis.io/download)
4. **Tesseract OCR** - Required for document processing
   - **macOS**: `brew install tesseract`
   - **Ubuntu/Debian**: `sudo apt-get install tesseract-ocr`
   - **Windows**: Download from [GitHub releases](https://github.com/UB-Mannheim/tesseract/wiki)
5. **Poppler** (for PDF processing) - Required for PDF to image conversion
   - **macOS**: `brew install poppler`
   - **Ubuntu/Debian**: `sudo apt-get install poppler-utils`
   - **Windows**: Download from [poppler-windows](http://blog.alivate.com.au/poppler-windows/)

### Step 1: Clone and Navigate to Backend Directory

```bash
cd healthcare-document-processor/backend
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Step 3: Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 4: Database Setup

#### 4.1 Install and Start PostgreSQL

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
- Download and install from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
- Start PostgreSQL service from Services panel

#### 4.2 Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE healthcare_docs;

# Create test database (optional)
CREATE DATABASE healthcare_docs_test;

# Exit PostgreSQL
\q
```

#### 4.3 Run Database Migrations

```bash
# Make sure you're in the backend directory with venv activated
cd healthcare-document-processor/backend
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run migrations
alembic upgrade head

# Initialize database with seed data
python app/core/database_init.py
```

### Step 5: Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cd healthcare-document-processor/backend
touch .env  # On Windows: type nul > .env
```

Add the following configuration to `.env`:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/healthcare_docs
TEST_DATABASE_URL=postgresql://postgres:password@localhost:5432/healthcare_docs_test

# Security
SECRET_KEY=your-super-secret-key-change-in-production-please-use-strong-random-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# AWS S3 Configuration (Required for file storage)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=healthcare-documents-bucket

# OpenAI Configuration (Required for embeddings and AI features)
OPENAI_API_KEY=your-openai-api-key

# Vector Database Configuration (Optional - uses ChromaDB by default)
# Leave empty to use ChromaDB (local)
# Set PINECONE_API_KEY to use Pinecone instead
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=

# OCR Configuration (Optional - uses system default if not set)
TESSERACT_CMD=/usr/local/bin/tesseract  # macOS default path
# TESSERACT_CMD=/usr/bin/tesseract  # Linux default path

# Redis Configuration (Optional - for background tasks)
REDIS_URL=redis://localhost:6379/0

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# File Upload Configuration
MAX_FILE_SIZE=52428800  # 50MB in bytes
ALLOWED_EXTENSIONS=pdf,png,jpg,jpeg,tiff
```

**Important Notes:**
- Replace `your-aws-access-key-id` and `your-aws-secret-access-key` with your actual AWS credentials
- Replace `your-openai-api-key` with your OpenAI API key
- Replace `password` in DATABASE_URL with your PostgreSQL password
- Generate a strong SECRET_KEY (you can use: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)

### Step 6: AWS S3 Setup

#### 6.1 Create S3 Bucket

1. Log in to AWS Console
2. Navigate to S3 service
3. Click "Create bucket"
4. Configure bucket:
   - **Bucket name**: `healthcare-documents-bucket` (or your preferred name)
   - **Region**: Choose your preferred region (e.g., `us-east-1`)
   - **Block Public Access**: Keep default settings (block all)
   - **Versioning**: Optional
5. Click "Create bucket"

#### 6.2 Create IAM User for S3 Access

1. Go to IAM → Users → Add users
2. Create user with programmatic access
3. Attach policy: `AmazonS3FullAccess` (or create custom policy with read/write access)
4. Save Access Key ID and Secret Access Key
5. Add credentials to `.env` file

### Step 7: OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add to `.env` file as `OPENAI_API_KEY`

### Step 8: Vector Database Setup (ChromaDB)

ChromaDB is installed automatically with dependencies. No additional setup required.

The vector database will be stored locally in `backend/chroma_db/` directory.

**Optional: Use Pinecone Instead**

If you want to use Pinecone (cloud-based) instead of ChromaDB:

1. Sign up at [Pinecone](https://www.pinecone.io/)
2. Create an API key
3. Note your environment (e.g., `us-east1-gcp`)
4. Add to `.env`:
   ```env
   PINECONE_API_KEY=your-pinecone-api-key
   PINECONE_ENVIRONMENT=us-east1-gcp
   ```

### Step 9: Verify Installation

Run the health check to verify all connections:

```bash
# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# In another terminal, test the health endpoint
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "1.0.0"
}
```

### Step 10: Run Backend Server

```bash
# Make sure virtual environment is activated
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API Base URL**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs` (Swagger UI)
- **Alternative Docs**: `http://localhost:8000/redoc` (ReDoc)

### Step 11: Test Authentication

Test the setup with a sample request:

```bash
# Register a test user
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "confirm_password": "testpassword123",
    "full_name": "Test User",
    "role": "patient"
  }'

# Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

### Troubleshooting

#### Database Connection Issues

**Error: "could not connect to server"**
- Ensure PostgreSQL is running: `pg_isready` or `brew services list` (macOS)
- Check DATABASE_URL in `.env` file
- Verify PostgreSQL password is correct

**Error: "database does not exist"**
- Create the database: `CREATE DATABASE healthcare_docs;`
- Run migrations: `alembic upgrade head`

#### OCR Issues

**Error: "TesseractNotFoundError"**
- Install Tesseract OCR (see Prerequisites)
- Set `TESSERACT_CMD` in `.env` if tesseract is not in PATH
- Verify installation: `tesseract --version`

**Error: "PDFInfoNotInstalledError"**
- Install Poppler utilities (see Prerequisites)
- Verify installation: `pdftoppm -v`

#### AWS S3 Issues

**Error: "Access Denied" or "Invalid credentials"**
- Verify AWS credentials in `.env`
- Check IAM user has S3 permissions
- Ensure bucket name matches `S3_BUCKET_NAME` in `.env`

#### OpenAI Issues

**Error: "Invalid API key"**
- Verify `OPENAI_API_KEY` in `.env`
- Check API key is active on OpenAI platform
- Ensure you have sufficient credits

#### ChromaDB Issues

**Error: "Permission denied" creating chroma_db directory**
- Ensure write permissions in backend directory
- Manually create directory: `mkdir -p chroma_db`
- Check directory permissions: `chmod 755 chroma_db`

### Production Deployment Considerations

For production deployment:

1. **Environment Variables**: Use secure secret management (AWS Secrets Manager, HashiCorp Vault, etc.)
2. **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
3. **File Storage**: Ensure S3 bucket has proper lifecycle policies and encryption
4. **Security**:
   - Use strong SECRET_KEY (generate with `secrets.token_urlsafe(32)`)
   - Enable HTTPS/SSL
   - Configure CORS properly
   - Set up rate limiting
5. **Monitoring**: Set up logging and monitoring (CloudWatch, Datadog, etc.)
6. **Backups**: Configure database backups and S3 versioning

### Quick Start Checklist

- [ ] Python 3.11+ installed
- [ ] PostgreSQL installed and running
- [ ] Virtual environment created and activated
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] `.env` file created with all required variables
- [ ] Database created and migrations run
- [ ] Tesseract OCR installed
- [ ] Poppler installed
- [ ] AWS S3 bucket created and credentials configured
- [ ] OpenAI API key configured
- [ ] Server starts successfully (`uvicorn main:app --reload`)
- [ ] Health check returns healthy status
- [ ] Can register and login a test user
