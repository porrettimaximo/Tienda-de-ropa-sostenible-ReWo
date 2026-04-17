from supabase import Client, create_client

from app.config import settings


def get_supabase_service_client() -> Client | None:
    key = settings.supabase_service_role_key
    if not settings.supabase_url or not key:
        return None

    try:
        return create_client(settings.supabase_url, key)
    except Exception as e:
        import logging
        logging.error(f"Error al inicializar cliente de Supabase (admin): {e}")
        return None


def get_supabase_anon_client() -> Client | None:
    if not settings.supabase_url or not settings.supabase_key:
        return None

    try:
        return create_client(settings.supabase_url, settings.supabase_key)
    except Exception as e:
        import logging
        logging.error(f"Error al inicializar cliente de Supabase (anon): {e}")
        return None
