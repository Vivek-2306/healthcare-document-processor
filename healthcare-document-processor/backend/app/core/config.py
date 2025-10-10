from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List, Optional
import os
import json
from dotenv import load_dotenv

load_dotenv()

def parse_list_from_env(env_var: str, default: List[str]) -> List[str]:
    """Parse a comma-separated list from environment variable or return default."""
    value = os.getenv(env_var)
    if not value:
        return default
    try:
        # Try to parse as JSON first
        return json.loads(value)
    except json.JSONDecodeError:
        # Fall back to comma-separated values
        return [item.strip() for item in value.split(",") if item.strip()]

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
    CORS_ORIGINS: List[str] = Field(default_factory=lambda: parse_list_from_env("CORS_ORIGINS", ["http://localhost:3000", "http://127.0.0.1:3000"]))

    # File Upload
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS: List[str] = Field(default_factory=lambda: parse_list_from_env("ALLOWED_EXTENSIONS", ["pdf", "png", "jpg", "jpeg", "tiff"]))
    UPLOAD_FOLDER: str = "uploads"

    class Config:
        env_file = ".env"
        # Disable automatic JSON parsing for list fields
        json_schema_extra = {
            "example": {
                "CORS_ORIGINS": ["http://localhost:3000", "http://127.0.0.1:3000"],
                "ALLOWED_EXTENSIONS": ["pdf", "png", "jpg", "jpeg", "tiff"]
            }
        }

# Create settings instance
settings = Settings()