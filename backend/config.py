import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

_BACKEND_DIR = Path(__file__).resolve().parent


@dataclass(frozen=True)
class Settings:
    supabase_url: str
    supabase_key: str


@lru_cache
def get_settings() -> Settings:
    load_dotenv(_BACKEND_DIR / ".env")
    return Settings(
        supabase_url=os.environ.get("SUPABASE_URL", "").strip(),
        supabase_key=os.environ.get("SUPABASE_KEY", "").strip(),
    )
