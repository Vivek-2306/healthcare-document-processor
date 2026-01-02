import imghdr
from typing import Iterable
from fastapi import HTTPException, UploadFile, status
from app.core.config import settings


def _detect_mimetype(content: bytes) -> str:
    image_type = imghdr.what(None, h=content)
    if image_type:
        return f"image/{image_type}"
    return "application/octet-stream"

async def validate_upload(file: UploadFile) -> None:
    allowed_ext: Iterable[str] = {ext.lower() for ext in settings.ALLOWED_EXTENSIONS}

    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in allowed_ext:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type .{file_ext} not allowed"
        )

    content = await file.read()
    await file.seek(0)

    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds max size of {settings.MAX_FILE_SIZE // (1024 * 1024)} MB"
        )
    detected = _detect_mimetype(content)
    if detected.startswith("image/") and file_ext not in {"png", "jpg", "jpeg", "tiff"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image content does not match the declare content"
        )