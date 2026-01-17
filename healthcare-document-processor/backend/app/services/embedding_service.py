from typing import List, Optional
import logging
import openai
from openai import OpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)

class EmbeddingService:

    def __init__(self, api_key: Optional[str] = None) -> None:
        # Get API key from parameter or settings
        raw_key = api_key or settings.OPENAI_API_KEY
        
        if not raw_key:
            raise ValueError("OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file")
        
        # Strip whitespace and newlines from the API key
        self.api_key = raw_key.strip()
        
        # Validate API key format (should start with 'sk-' for OpenAI)
        if not self.api_key.startswith('sk-'):
            logger.warning(f"API key doesn't start with 'sk-'. Key starts with: {self.api_key[:10]}...")
        
        # Log first and last few characters for debugging (without exposing full key)
        logger.info(f"Initializing OpenAI client with API key: {self.api_key[:7]}...{self.api_key[-4:]}")
        
        try:
            self.client = OpenAI(api_key=self.api_key)
            self.model = "text-embedding-ada-002"
            self.dimension = 1536
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI client: {e}")
            raise ValueError(f"Failed to initialize OpenAI client: {e}")

    def generate_embedding(self, text: str) -> List[float]:
        try:
            # Ensure text is actually a string
            if not isinstance(text, str):
                raise ValueError(f"Expected string, got {type(text).__name__}")
            
            text = text.strip()
            if not text:
                raise ValueError("Text cannot be empty")

            max_chars = 8000
            if len(text) > max_chars:
                text = text[:max_chars]
                logger.warning(f"Text truncated to {max_chars} characters")

            response = self.client.embeddings.create(
                model=self.model,
                input=text
            )

            return response.data[0].embedding

        except openai.AuthenticationError as e:
            logger.error(f"OpenAI authentication error. Please check your API key. Key starts with: {self.api_key[:7]}...")
            raise ValueError(f"Invalid OpenAI API key. Please verify your OPENAI_API_KEY in .env file. Error: {str(e)}")
        except openai.APIError as e:
            logger.error(f"OpenAI API error: {e}")
            raise ValueError(f"OpenAI API error: {str(e)}")
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise

    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        try:
            cleaned_texts = [text.strip() for text in texts if text.strip()]
            if not cleaned_texts:
                return []

            max_chars = 8000
            cleaned_texts = [
                text[:max_chars] if len(text) > max_chars else text
                for text in cleaned_texts
            ]

            batch_size = 100
            all_embeddings = []

            for i in range(0, len(cleaned_texts), batch_size):
                batch = cleaned_texts[i:i+batch_size]

                response = self.client.embeddings.create(
                    model = self.model,
                    input=batch
                )

                batch_embeddings = [item.embedding for item in response.data]
                all_embeddings.extend(batch_embeddings)

            return all_embeddings

        except openai.AuthenticationError as e:
            logger.error(f"OpenAI authentication error. Please check your API key. Key starts with: {self.api_key[:7]}...")
            raise ValueError(f"Invalid OpenAI API key. Please verify your OPENAI_API_KEY in .env file. Error: {str(e)}")
        except openai.APIError as e:
            logger.error(f"OpenAI API error: {e}")
            raise ValueError(f"OpenAI API error: {str(e)}")
        except Exception as e:
            logger.error(f"Error generating batch embeddings: {e}")
            raise

    def get_embedding_dimensions(self) -> int:
        return self.dimension