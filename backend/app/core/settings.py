from typing import Literal, Optional

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # App
    app_name: str = Field(default="Zemen Pharma", validation_alias=AliasChoices("APP_NAME", "app_name"))
    environment: Literal["development", "staging", "production"] = Field(
        default="development", validation_alias=AliasChoices("ENVIRONMENT", "environment")
    )
    debug: bool = Field(default=True, validation_alias=AliasChoices("DEBUG", "debug"))
    cors_origins: Optional[str] = Field(default=None, validation_alias=AliasChoices("CORS_ORIGINS", "cors_origins"))
    use_langgraph: bool = Field(default=False, validation_alias=AliasChoices("USE_LANGGRAPH", "use_langgraph"))
    enable_scheduler: bool = Field(default=False, validation_alias=AliasChoices("ENABLE_SCHEDULER", "enable_scheduler"))
    scheduler_tenants: Optional[str] = Field(default=None, validation_alias=AliasChoices("SCHEDULER_TENANTS", "scheduler_tenants"))
    scheduler_interval_seconds: int = Field(default=600, validation_alias=AliasChoices("SCHEDULER_INTERVAL_SECONDS", "scheduler_interval_seconds"))

    # Database / Cache
    database_url: Optional[str] = Field(default=None, validation_alias=AliasChoices("DATABASE_URL", "database_url"))
    redis_url: Optional[str] = Field(default=None, validation_alias=AliasChoices("REDIS_URL", "redis_url"))

    # AI API
    gemini_api_key: Optional[str] = Field(default=None, validation_alias=AliasChoices("GEMINI_API_KEY", "gemini_api_key"))

    # Auth
    jwt_secret: Optional[str] = Field(default=None, validation_alias=AliasChoices("JWT_SECRET", "jwt_secret"))
    jwt_algorithm: str = Field(default="HS256", validation_alias=AliasChoices("JWT_ALGORITHM", "jwt_algorithm"))
    access_token_expires_minutes: int = Field(
        default=30, validation_alias=AliasChoices("ACCESS_TOKEN_EXPIRES_MINUTES", "access_token_expires_minutes")
    )

    # Rate limits
    rate_limit_general_per_minute: int = Field(
        default=60, validation_alias=AliasChoices("RATE_LIMIT_GENERAL_PER_MINUTE", "rate_limit_general_per_minute")
    )
    rate_limit_gemini_per_minute: int = Field(
        default=30, validation_alias=AliasChoices("RATE_LIMIT_GEMINI_PER_MINUTE", "rate_limit_gemini_per_minute")
    )

    # Email
    email_enabled: bool = Field(default=False, validation_alias=AliasChoices("EMAIL_ENABLED", "email_enabled"))
    smtp_host: Optional[str] = Field(default=None, validation_alias=AliasChoices("SMTP_HOST", "smtp_host"))
    smtp_port: int = Field(default=587, validation_alias=AliasChoices("SMTP_PORT", "smtp_port"))
    smtp_username: Optional[str] = Field(default=None, validation_alias=AliasChoices("SMTP_USERNAME", "smtp_username"))
    smtp_password: Optional[str] = Field(default=None, validation_alias=AliasChoices("SMTP_PASSWORD", "smtp_password"))
    smtp_use_tls: bool = Field(default=True, validation_alias=AliasChoices("SMTP_USE_TLS", "smtp_use_tls"))
    email_from: Optional[str] = Field(default=None, validation_alias=AliasChoices("EMAIL_FROM", "email_from"))


settings = Settings()
