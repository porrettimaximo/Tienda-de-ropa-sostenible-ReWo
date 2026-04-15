from app.repositories.memory_repository import MemoryRepository
from app.repositories.supabase_repository import SupabaseRepository


class HybridRepository:
    def __init__(self) -> None:
        self.memory = MemoryRepository()
        self.supabase = SupabaseRepository()

    def backend(self):
        return self.supabase if self.supabase.is_enabled() else self.memory
