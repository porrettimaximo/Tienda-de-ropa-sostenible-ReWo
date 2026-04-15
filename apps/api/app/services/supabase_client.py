from supabase import Client, create_client

from app.config import settings


def get_supabase_client() -> Client | None:
    key = settings.supabase_service_role_key or settings.supabase_key
    if not settings.supabase_url or not key:
        return None

    return create_client(settings.supabase_url, key)
