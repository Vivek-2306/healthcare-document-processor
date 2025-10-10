# Phase 1.3: Database Configuration - Commands and Code Examples

## Commands for Phase 1.3

### Step 1: Initialize Alembic for Database Migrations
```bash
# Make sure you're in the backend directory with venv activated
cd healthcare-document-processor/backend
venv\Scripts\activate  # Windows

# Initialize Alembic
alembic init alembic

# This creates alembic/ directory and alembic.ini file
```

### Step 2: Install PostgreSQL (if not already installed)
```bash
# Option 1: Using Docker (Recommended for development)
docker run --name postgres-dev -e POSTGRES_PASSWORD=password -e POSTGRES_DB=healthcare_docs -p 5432:5432 -d postgres:13

# Option 2: Download and install PostgreSQL from official website
# https://www.postgresql.org/download/windows/

# Option 3: Using Chocolatey (if you have it)
choco install postgresql
```

### Step 3: Install Redis (for Celery background tasks)
```bash
# Option 1: Using Docker
docker run --name redis-dev -p 6379:6379 -d redis:alpine

# Option 2: Download Redis for Windows
# https://github.com/microsoftarchive/redis/releases
```

## Code Examples for Phase 1.3

### 1. Environment Variables (.env file)
```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/healthcare_docs
TEST_DATABASE_URL=postgresql://postgres:password@localhost:5432/healthcare_docs_test

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# JWT Configuration
SECRET_KEY=your-super-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=healthcare-documents-bucket

# AI/ML Configuration
OPENAI_API_KEY=your-openai-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment

# OCR Configuration
TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe  # Windows
# TESSERACT_CMD=/usr/bin/tesseract  # Linux/Mac

# Application Configuration
APP_NAME=Healthcare Document Processor
APP_VERSION=1.0.0
DEBUG=True
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]

# File Upload Configuration
MAX_FILE_SIZE=50MB
ALLOWED_EXTENSIONS=pdf,png,jpg,jpeg,tiff
UPLOAD_FOLDER=uploads
```

### 2. Database Configuration (app/core/database.py)
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/healthcare_docs")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=False  # Set to True for SQL query logging
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Test database connection
def test_db_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute("SELECT 1")
            print("Database connection successful!")
            return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False
```

### 3. Core Configuration (app/core/config.py)
```python
from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Healthcare Document Processor"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/healthcare_docs")
    TEST_DATABASE_URL: str = os.getenv("TEST_DATABASE_URL", "postgresql://postgres:password@localhost:5432/healthcare_docs_test")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # AWS
    AWS_ACCESS_KEY_ID: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    S3_BUCKET_NAME: str = os.getenv("S3_BUCKET_NAME", "healthcare-documents-bucket")
    
    # AI/ML
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    PINECONE_API_KEY: Optional[str] = os.getenv("PINECONE_API_KEY")
    PINECONE_ENVIRONMENT: Optional[str] = os.getenv("PINECONE_ENVIRONMENT")
    
    # OCR
    TESSERACT_CMD: Optional[str] = os.getenv("TESSERACT_CMD")
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # File Upload
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "png", "jpg", "jpeg", "tiff"]
    UPLOAD_FOLDER: str = "uploads"
    
    class Config:
        env_file = ".env"

# Create settings instance
settings = Settings()
```

### 4. Alembic Configuration (alembic.ini)
```ini
# A generic, single database configuration.

[alembic]
# path to migration scripts
script_location = alembic

# template used to generate migration file names; The default value is %%(rev)s_%%(slug)s
# Uncomment the line below if you want the files to be prepended with date and time
# file_template = %%(year)d_%%(month).2d_%%(day).2d_%%(hour).2d%%(minute).2d-%%(rev)s_%%(slug)s

# sys.path path, will be prepended to sys.path if present.
# defaults to the current working directory.
prepend_sys_path = .

# timezone to use when rendering the date within the migration file
# as well as the filename.
# If specified, requires the python-dateutil library that can be
# installed by adding `alembic[tz]` to the pip requirements
# string value is passed to dateutil.tz.gettz()
# leave blank for localtime
# timezone =

# max length of characters to apply to the
# "slug" field
# truncate_slug_length = 40

# set to 'true' to run the environment during
# the 'revision' command, regardless of autogenerate
# revision_environment = false

# set to 'true' to allow .pyc and .pyo files without
# a source .py file to be detected as revisions in the
# versions/ directory
# sourceless = false

# version number format.  This value may be changed to
# support additional formats, but the default is the
# version path format.
# version_num_format = %(year)d%(month).2d%(day).2d_%(hour).2d%(minute).2d

# version path separator; As mentioned above, this is the character used to split
# version_locations. The default within new alembic.ini files is "os", which uses
# os.pathsep. If this key is omitted entirely, it falls back to the legacy
# behavior of splitting on spaces and/or commas.
# Valid values for version_path_separator are:
#
# version_path_separator = :
# version_path_separator = ;
# version_path_separator = space
version_path_separator = os

# set to 'true' to search source files recursively
# in each "version_locations" directory
# new in Alembic version 1.10
# recursive_version_locations = false

# the output encoding used when revision files
# are written from script.py.mako
# output_encoding = utf-8

sqlalchemy.url = postgresql://postgres:password@localhost:5432/healthcare_docs


[post_write_hooks]
# post_write_hooks defines scripts or Python functions that are run
# on newly generated revision scripts.  See the documentation for further
# detail and examples

# format using "black" - use the console_scripts runner, against the "black" entrypoint
# hooks = black
# black.type = console_scripts
# black.entrypoint = black
# black.options = -l 79 REVISION_SCRIPT_FILENAME

# lint with attempts to fix using "ruff" - use the exec runner, execute a binary
# hooks = ruff
# ruff.type = exec
# ruff.executable = %(here)s/.venv/bin/ruff
# ruff.options = --fix REVISION_SCRIPT_FILENAME

# Logging configuration
[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

### 5. Alembic Environment (alembic/env.py)
```python
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import os
import sys
from dotenv import load_dotenv

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Load environment variables
load_dotenv()

# Import your models here
from app.core.database import Base
from app.models import user, document, analysis, chunk  # Import all models

# this is the Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set the database URL from environment variable
config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/healthcare_docs"))

# add your model's MetaData object here
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

### 6. Database Initialization Script (app/core/database_init.py)
```python
from sqlalchemy import create_engine, text
from app.core.database import engine, Base
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_database():
    """Create database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server (not to specific database)
        server_url = settings.DATABASE_URL.rsplit('/', 1)[0] + '/postgres'
        server_engine = create_engine(server_url)
        
        with server_engine.connect() as conn:
            # Create database if it doesn't exist
            database_name = settings.DATABASE_URL.split('/')[-1]
            conn.execute(text(f"CREATE DATABASE {database_name}"))
            logger.info(f"Database {database_name} created successfully")
            
    except Exception as e:
        logger.error(f"Error creating database: {e}")

def create_tables():
    """Create all tables"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("All tables created successfully")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")

def init_database():
    """Initialize database and create tables"""
    try:
        # Create database if needed
        create_database()
        
        # Create tables
        create_tables()
        
        logger.info("Database initialization completed successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

if __name__ == "__main__":
    init_database()
```

## Verification Commands for Phase 1.3

### Test Database Connection:
```bash
# Test PostgreSQL connection
python -c "from app.core.database import test_db_connection; test_db_connection()"

# Test Redis connection
python -c "import redis; r = redis.Redis(host='localhost', port=6379, db=0); print('Redis connection:', r.ping())"
```

### Initialize Database:
```bash
# Run database initialization
python app/core/database_init.py

# Create first migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

## Next Steps After Phase 1.3:

1. **Verify all connections work**
2. **Test database initialization**
3. **Move to Phase 2** - Create database models
4. **Create your first migration**

## Important Notes:

- **Change SECRET_KEY** in production
- **Update database credentials** to match your setup
- **Install PostgreSQL and Redis** before testing
- **All environment variables** should be set in `.env` file

Let me know when you've completed Phase 1.3, and I'll show you **Phase 2** (Database Models) commands and code examples!
