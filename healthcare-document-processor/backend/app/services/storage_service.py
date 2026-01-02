import mimetypes
from pathlib import Path
from typing import BinaryIO, Optional
from uuid import uuid4
import uuid

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import HTTPException, status
from sqlalchemy.sql.coercions import expect

from app.core.config import settings

class S3StorageService:

    def __init__(
        self,
        bucket_name: str = settings.S3_BUCKET_NAME,
        region: str = settings.AWS_REGION,
        access_key: Optional[str] = settings.AWS_ACCESS_KEY_ID,
        secret_key: Optional[str] = settings.AWS_SECRET_ACCESS_KEY,
        ) -> None:
        self.bucket = bucket_name

        session = boto3.Session(
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )

        self.client = session.client("s3")

    def _build_object_key(self, user_id: str, filename: str) -> str:
        file_ext = Path(filename).suffix.lower()
        unique_id = uuid4()
        return f"user/{user_id}/{unique_id}{file_ext}"

    def upload_file(
        self, 
        file_obj: BinaryIO,
        filename: str,
        user_id: str,
        content_type: Optional[str] = None
    ) -> str:

        object_key = self._build_object_key(user_id, filename)
        guessed_type, _ = mimetypes.guess_type(filename)
        content_type = content_type or guessed_type or "application/octet-stream"

        try:
            self.client.upload_fileobj(
                file_obj,
                self.bucket,
                object_key,
                ExtraAgrs = {
                    "ACL": "private",
                    "ContentType": content_type,
                    "ServerSideEncryption": "AES256"
                }
            )
        except (BotoCoreError, ClientError) as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to upload file to storage: {exc}"
            )

    def generate_presigned_url(
        self,
        object_key: str,
        expires_in: int = 600
    ) -> str:
        try:
            return self.client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket, "Key": object_key},
                ExpiresIn=expires_in
            )
        except (BotoCoreError, ClientError) as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to generate download url: {exc}"
            )