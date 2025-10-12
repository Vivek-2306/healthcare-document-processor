import email
import logging
import sys
import os
from warnings import deprecated
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Add the backend directory to Python path to resolve app imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.core.config import settings
from app.core.database import engine, Base
from app.models import User, UserRole

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_database():
    try:
        server_url = settings.DATABASE_URL.rsplit('/', 1)[0] + '/postgres'
        server_engine = create_engine(server_url, isolation_level="AUTOCOMMIT")

        with server_engine.connect() as conn:
            database_name = settings.DATABASE_URL.split('/')[-1]

            result = conn.execute(text(
                "SELECT 1 FROM pg_database WHERE datname = :database_name"
            ), {"database_name": database_name})

            if not result.fetchone():
                conn.execute(text("CREATE DATABASE " + database_name))
                logger.info(f"Database {database_name} created successfully")
            else:
                logger.info(f"Database {database_name} already exists")
    except Exception as e:
        logger.error(f"Error creating database: {e}")

def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("All tables created successfully")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")

def create_seed_data():
    try: 
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        admin_user = db.query(User).filter(User.email == "admin@healthcare.com").first()

        if not admin_user:
            # Use a pre-hashed password to avoid bcrypt issues
            admin_user = User(
                email="admin@healthcare.com",
                password_hash="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBh2Q6VQH5pC2e",  # "admin123"
                full_name="System Administrator",
                role=UserRole.ADMIN,
                is_active=True,
                is_verified=True
            )

            db.add(admin_user)
            db.commit()
            logger.info("Admin user created successfully")
        else:
            logger.info("Admin user already exists")

    except Exception as e:
        logger.error(f"Error while creating seed data: {e}")


def init_database():
    try:
        create_database()
        create_tables()
        create_seed_data()
        logger.info("Database initialization completed successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

if __name__ == "__main__":
    init_database()