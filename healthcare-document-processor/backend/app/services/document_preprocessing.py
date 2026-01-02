import re
from typing import List, Tuple
from app.services.ocr_service import OCRService

class DocumentPreprocessor:
    def __init__(self, ocr_service: OCRService) -> None:
        self.ocr_service = ocr_service

    def clean_text(self, text: str) -> str:
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s\.\,\;\:\!\?\-\(\)\\[\]\{\}]', ' ', text)
        text = re.sub(r'\n{3, }', '\n\n', text)
        text = text.strip()
        return text

    def chunk_text(self, text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[dict]:
        if not text:
            return []

        chunks = []
        words = text.split()

        if len(words) <= chunk_size:
            return [{
                'content': text,
                'chunk_index': 0,
                'start_char': 0,
                'end_char': len(text)
            }]

        start_idx = 0
        chunk_index = 0

        while start_idx < len(words):
            end_idx = min(start_idx + chunk_size, len(words))
            chunk_words = words[start_idx:end_idx]
            chunk_text = ' '.join(chunk_words)

            start_char = text.find(chunk_words[0] if chunk_words else 0)
            end_char = start_char + len(chunk_text)

            chunks.append({
                'content': chunk_text,
                'chunk_index': chunk_index,
                'start_char': start_char,
                'end_char': end_char,
                'word_count': len(chunk_words)
            })

            start_idx = end_idx - chunk_overlap
            chunk_index += 1

        return chunks

    def process_document(
        self, 
        file_bytes: bytes,
        filename: str,
        mime_type: str,
        chunk_size: int = 1000,
        chunk_overlap: int = 200
    ) -> dict:
        raw_text, ocr_metadata = self.ocr_service.extract_text_from_file(
            file_bytes, filename, mime_type
        )
        cleaned_text = self.clean_text(raw_text)
        chunks = self.chunk_text(cleaned_text, chunk_size, chunk_overlap)

        return {
            'raw_text': raw_text,
            'cleaned_text': cleaned_text,
            'chunks': chunks,
            'ocr_metadata': ocr_metadata,
            'total_chunks': len(chunks),
            'total_characters': len(cleaned_text),
            'total_words': len(cleaned_text.split())
        }