from supabase import Client, create_client

from app.config import settings


def get_supabase_client() -> Client | None:
    if not settings.supabase_url or not settings.supabase_key:
        return None

    return create_client(settings.supabase_url, settings.supabase_key)
