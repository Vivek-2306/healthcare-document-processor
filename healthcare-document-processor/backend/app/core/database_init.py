import logging
import sys
import os
from sqlalchemy import create_engine, text

# Add the backend directory to Python path to resolve app imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.core.database import engine, Base
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_database():
    try:
        server_url = settings.DATABASE_URL.rsplit('/', 1)[0] + '/postgres'
        server_engine = create_engine(server_url)

        with server_engine.connect() as conn:
            database_name = settings.DATABASE_URL.split('/')[-1]
            conn.execute(text("CREATE DATABASE :database_name"), {"database_name": database_name})
            logger.info(f"Database {database_name} created successfully")
    except Exception as e:
        logger.error(f"Error creating database: {e}")

def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("All tables created successfully")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")

def init_database():
    try:
        create_database()
        create_tables()
        logger.info("Database initialization completed successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

if __name__ == "__main__":
    init_database()