from pydoc import text
from typing import List, Optional
import logging
import openai
from openai import OpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)

class EmbeddingService:

    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or settings.OPENAI_API_KEY
        if not self.api_key:
            raise ValueError("Open API key not configured")
        
        self.client = OpenAI(api_key=self.api_key)
        self.model = "text-embedding-ada-002"
        self.dimension = 1536

    def generate_embedding(self, text: str) -> List[float]:
        try:
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

                batch_embeddings = [item.embeddings for item in response.data]
                all_embeddings.extend(batch_embeddings)

            return all_embeddings

        except Exception as e:
            logger.error(f"Error generating batch embeddings: {e}")
            raise

    def get_embedding_dimensions(self) -> int:
        return self.dimension