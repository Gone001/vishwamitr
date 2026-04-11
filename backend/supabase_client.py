from functools import lru_cache
import requests
from config import get_settings
import urllib.parse


class SupabaseRestClient:
    def __init__(self, url: str, key: str):
        self.url = url.rstrip("/")
        self.key = key
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        }

    def table(self, table_name: str):
        return SupabaseTable(self.url, table_name, self.headers)


class SupabaseTable:
    def __init__(self, url: str, table: str, headers: dict):
        self.url = url
        self.table = table
        self.headers = headers
        self._filters = {}
        self._columns = "*"
        self._limit = None
        self._order = None

    def select(self, columns: str = "*"):
        self._columns = columns
        return self

    def eq(self, field: str, value):
        self._filters[field] = value
        return self

    def limit(self, count: int):
        self._limit = count
        return self

    def order(self, field: str, desc: bool = False):
        self._order = f"{field}.{'desc' if desc else 'asc'}"
        return self

    def execute(self):
        url = f"{self.url}/rest/v1/{self.table}"
        params = {"select": self._columns}
        
        if self._limit:
            params["limit"] = str(self._limit)
        if self._order:
            params["order"] = self._order
            
        for field, value in self._filters.items():
            params[field] = f"eq.{value}"

        resp = requests.get(url, headers=self.headers, params=params)
        resp.raise_for_status()
        return type("obj", (object,), {"data": resp.json()})()

    def insert(self, data: dict):
        url = f"{self.url}/rest/v1/{self.table}"
        resp = requests.post(url, headers=self.headers, json=data)
        resp.raise_for_status()
        return type("obj", (object,), {"data": resp.json()})()

    def update(self, data: dict):
        url = f"{self.url}/rest/v1/{self.table}"
        
        filters = [(k, v) for k, v in self._filters.items()]
        query = "&".join([f"{field}=eq.{value}" for field, value in filters])
        if query:
            url += "?" + query
        
        resp = requests.patch(url, headers=self.headers, json=data)
        print(f"PATCH URL: {url}")
        resp.raise_for_status()
        return type("obj", (object,), {"data": []})()


@lru_cache
def get_supabase() -> SupabaseRestClient:
    s = get_settings()
    if not s.supabase_url or not s.supabase_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set in backend/.env")
    return SupabaseRestClient(s.supabase_url, s.supabase_key)