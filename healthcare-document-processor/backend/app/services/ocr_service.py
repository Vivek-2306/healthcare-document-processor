from curses import meta
import io
import logging
import platform
import shutil
from pathlib import Path
from re import L
from typing import List, Optional, Tuple
from pdf2image.pdf2image import PDFInfoNotInstalledError
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import pdf2image
from pdf2image.exceptions import PDFInfoNotInstalledError, PDFPageCountError
from app.core.config import settings

logger = logging.getLogger(__name__)

class OCRService:
    def __init__(self, tesseract_cmd: Optional[str] = None):
        # Determine Tesseract command path
        tesseract_path = self._find_tesseract(tesseract_cmd)
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
            logger.info(f"Tesseract OCR initialized at: {tesseract_path}")
        else:
            # Will raise error when actually trying to use OCR
            logger.warning("Tesseract OCR not found. OCR operations will fail until Tesseract is installed.")
    
    def _find_tesseract(self, explicit_path: Optional[str] = None) -> Optional[str]:
        """Find Tesseract executable path."""
        # 1. Use explicitly provided path
        if explicit_path:
            if Path(explicit_path).exists():
                return explicit_path
            logger.warning(f"Explicit Tesseract path not found: {explicit_path}")
        
        # 2. Use path from settings
        if settings.TESSERACT_CMD:
            if Path(settings.TESSERACT_CMD).exists():
                return settings.TESSERACT_CMD
            logger.warning(f"TESSERACT_CMD from settings not found: {settings.TESSERACT_CMD}")
        
        # 3. Try to find in PATH
        tesseract_in_path = shutil.which('tesseract')
        if tesseract_in_path:
            return tesseract_in_path
        
        # 4. Try common installation paths based on OS
        system = platform.system().lower()
        common_paths = []
        
        if system == 'darwin':  # macOS
            common_paths = [
                '/usr/local/bin/tesseract',
                '/opt/homebrew/bin/tesseract',
                '/usr/bin/tesseract',
            ]
        elif system == 'linux':
            common_paths = [
                '/usr/bin/tesseract',
                '/usr/local/bin/tesseract',
            ]
        elif system == 'windows':
            common_paths = [
                r'C:\Program Files\Tesseract-OCR\tesseract.exe',
                r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
            ]
        
        for path in common_paths:
            if Path(path).exists():
                return path
        
        return None
    
    def _verify_tesseract(self) -> None:
        """Verify Tesseract is available and raise helpful error if not."""
        try:
            pytesseract.get_tesseract_version()
        except Exception as e:
            system = platform.system().lower()
            if system == 'darwin':  # macOS
                install_cmd = "brew install tesseract"
                error_msg = (
                    "Tesseract OCR is not installed or not found in PATH.\n"
                    f"Install with: {install_cmd}\n"
                    "After installation, restart the application.\n"
                    "If Tesseract is installed but not in PATH, set TESSERACT_CMD in your .env file."
                )
            elif system == 'linux':
                install_cmd = "sudo apt-get install tesseract-ocr"
                error_msg = (
                    "Tesseract OCR is not installed or not found in PATH.\n"
                    f"Install with: {install_cmd}\n"
                    "After installation, restart the application.\n"
                    "If Tesseract is installed but not in PATH, set TESSERACT_CMD in your .env file."
                )
            elif system == 'windows':
                error_msg = (
                    "Tesseract OCR is not installed or not found in PATH.\n"
                    "Download and install from: https://github.com/UB-Mannheim/tesseract/wiki\n"
                    "Add Tesseract installation directory to your PATH environment variable,\n"
                    "or set TESSERACT_CMD in your .env file to the full path (e.g., C:\\Program Files\\Tesseract-OCR\\tesseract.exe)."
                )
            else:
                error_msg = (
                    "Tesseract OCR is not installed or not found in PATH.\n"
                    "Please install Tesseract OCR for your operating system.\n"
                    "Set TESSERACT_CMD in your .env file if Tesseract is installed but not in PATH."
                )
            
            logger.error(error_msg)
            raise RuntimeError(error_msg) from e

    def preprocess_image(self, image: Image.Image) -> Image.Image:
        if image.mode != 'L':
            image = image.convert('L')

        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.5)

        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(2.0)

        image = image.filter(ImageFilter.MedianFilter(size=3))

        return image

    def extract_text_from_image(self, image: Image.Image, lang:str = 'eng') -> Tuple[str, dict]:
        try:
            self._verify_tesseract()
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

        except RuntimeError:
            # Re-raise our helpful error messages
            raise
        except Exception as e:
            error_str = str(e).lower()
            # Check if it's a Tesseract not found error
            if 'tesseract' in error_str and ('not installed' in error_str or 'not in your path' in error_str or 'not found' in error_str):
                self._verify_tesseract()  # This will raise a helpful error
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
            system = platform.system().lower()
            if system == 'darwin':  # macOS
                install_cmd = "brew install poppler"
                error_msg = (
                    "poppler-utils not installed. Poppler is required for PDF processing.\n"
                    f"Install with: {install_cmd}\n"
                    "After installation, restart the application."
                )
            elif system == 'linux':
                install_cmd = "sudo apt-get install poppler-utils"
                error_msg = (
                    "poppler-utils not installed. Poppler is required for PDF processing.\n"
                    f"Install with: {install_cmd}\n"
                    "After installation, restart the application."
                )
            elif system == 'windows':
                error_msg = (
                    "poppler-utils not installed. Poppler is required for PDF processing.\n"
                    "Download and install from: http://blog.alivate.com.au/poppler-windows/\n"
                    "Add poppler bin directory to your PATH environment variable."
                )
            else:
                error_msg = (
                    "poppler-utils not installed. Poppler is required for PDF processing.\n"
                    "Please install poppler-utils for your operating system."
                )
            
            logger.error(error_msg)
            raise RuntimeError(error_msg)

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