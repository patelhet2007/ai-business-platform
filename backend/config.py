import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Business Operations Intelligence Platform"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkeyforaibusinessopsintelligenceplatform2026")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/ai_ops_db")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # AI Providers
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", "mock-key")
    QWEN_API_KEY: Optional[str] = os.getenv("QWEN_API_KEY", "mock-key")
    
    # Integrations
    TALLY_SYNC_URL: Optional[str] = os.getenv("TALLY_SYNC_URL", "http://localhost:9000")
    WHATSAPP_API_TOKEN: Optional[str] = os.getenv("WHATSAPP_API_TOKEN", "mock-whatsapp-token")
    RAZORPAY_KEY_ID: Optional[str] = os.getenv("RAZORPAY_KEY_ID", "mock-razorpay-key")
    RAZORPAY_KEY_SECRET: Optional[str] = os.getenv("RAZORPAY_KEY_SECRET", "mock-razorpay-secret")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
