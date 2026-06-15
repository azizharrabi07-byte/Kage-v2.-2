"""Application configuration via environment variables using pydantic-settings."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """KAGE API configuration loaded from environment variables / .env file."""

    supabase_url: str
    supabase_service_key: str
    supabase_jwt_secret: str
    gemini_api_key: str = ""
    dev_bypass_auth: bool = False
    cors_origins: str = "*"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
