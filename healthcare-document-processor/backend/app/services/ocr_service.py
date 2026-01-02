from curses import meta
import io
import logging
from pathlib import Path
from re import L
from typing import List, Optional, Tuple
from pdf2image.pdf2image import PDFInfoNotInstalledError
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import pdf2image
from pdf2image.exceptions import PDFInfoNotInstalledError, PDFPageCountError

from core.config import settings

logger = logging.getLogger(__name__)

class OCRService:
    def __init__(self, tesseract_cmd: Optional[str] = None):
        if tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
        elif settings.TESSERACT_CMD:
            pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

    def preprocess_image(self, image: Image.Image) -> Image.Image:
        if image.mode != 'L':
            image.image.convert('L')

        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.5)

        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(2.0)

        image = image.filter(ImageFilter.MedianFilter(size=3))

        return image

    def extract_text_from_image(self, image: Image.Image, lang:str = 'eng') -> Tuple[str, dict]:
        try:
            processed_image = self.preprocess_image(image)

            ocr_data = pytesseract.image_to_data(
                processed_image,
                lang=lang,
                output_type=pytesseract.Output.DICT
            )

            text_parts = []
            for i, word in enumerate(ocr_data['text']):
                if int(ocr_data['conf'][i]) > 0:
                    text_parts.append(word)

            full_text = ' '.join(text_parts)
            confidences = [int(conf) for conf in ocr_data['conf'] if int(conf) > 0]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0

            metadata = {
                'confidence': avg_confidence,
                'word_count': len([w for w in text_parts if w.strip()]),
                'language' : lang
            }

            return full_text, metadata

        except Exception as e:
            logger.error(f"Error extracting text from image: {e}")
            raise

    def extract_text_from_pdf(self, pdf_bytes: bytes, first_page: int = 1, last_page: Optional[int] = None):
        try:
            images = pdf2image.convert_from_bytes(
                pdf_bytes,
                first_page=first_page,
                last_page=last_page,
                dpi=300,
                fmt='png'
            )

            all_texts = []
            all_metadata = []

            for page_num, image in enumerate(images, start=first_page):
                text, metadata = self.extract_text_from_image(image)
                metadata['page_number'] = page_num
                all_texts.append(text)
                all_metadata.append(metadata)

            return all_texts, all_metadata

        except PDFInfoNotInstalledError:
            logger.error("poppler-utils not installed. Install with: apt-get install poppler-utils")
            raise

        except PDFPageCountError as e:
            logger.error(f"Error reading PDF: {e}")
            raise

        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            raise

    def extract_text_from_file(self, file_bytes: bytes, filename: str, mime_type: str) -> Tuple[str, dict]:
        file_ext = Path(filename).suffix.lower()

        if file_ext == '.pdf' or mime_type == 'application/pdf':
            texts, metadata_list = self.extract_text_from_pdf(file_bytes)
            full_text = '\n\n'.join(texts)
            combined_metadata = {
                'total_pages': len(texts),
                'average_confidence': sum(m.get('confidence', 0) for m in metadata_list) / len(metadata_list) if metadata_list else 0,
                'total_words': sum(m.get('word_count', 0) for m in metadata_list),
                'pages': metadata_list
            }

            return full_text, combined_metadata

        elif file_ext in ['.png', '.jpg', '.jpeg', '.tiff', '.tif'] or mime_type.startswith('image/'):
            image = Image.open(io.BytesIO(file_bytes))
            text, metadata = self.extract_text_from_image(image)
            return text, metadata
        
        else:
            raise ValueError(f"Unsupported file type: {file_ext} or {mime_type}")

    def detect_orientation(self, image: Image.Image) -> dict:
        try:
            osd = pytesseract.image_to_osd(image)
            return {
                'orientation': 'unknown',
                'script': 'unknown',
                'script_confidence': 0
            }
        except Exception as e:
            logger.warning(f"Cound not detect orientation: {e}")
            return {
                'orientation': 'unknown',
                'script': 'unknown',
                'script_confidence': 0
            }