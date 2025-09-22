from supabase import create_client, Client
from uuid import uuid4
import os
from ..config import settings

SUPABASE_URL = settings.supabase_url
SUPABASE_SERVICE_ROLE_KEY = settings.supabase_service_role_key

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("SUPABASE_URL и SUPABASE_ANON_KEY должны быть заданы в переменных окружения")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
BUCKET_NAME = "images"

def upload_image_to_supabase(file, filename: str) -> str:
    """
    Загружает файл в Supabase Storage и возвращает публичный URL
    """
    ext = filename.rsplit(".", 1)[-1].lower()
    unique_name = f"{uuid4()}.{ext}"

    # читаем данные файла
    file_data = file.read()

    # загружаем в Supabase — если ошибка, выбросится исключение
    supabase.storage.from_(BUCKET_NAME).upload(unique_name, file_data)

    # получаем публичный URL
    url_res = supabase.storage.from_(BUCKET_NAME).get_public_url(unique_name)
    return url_res
