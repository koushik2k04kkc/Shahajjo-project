from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API settings
    PROJECT_NAME: str = "bKash Analytics Engine"
    API_V1_STR: str = "/api/v1"
    
    # OpenAI settings
    OPENAI_API_KEY: str | None = None
    OPENAI_MODEL: str = "gpt-4o"
    
    # Z-Score Thresholds
    Z_SCORE_MEDIUM: float = 2.0
    Z_SCORE_HIGH: float = 3.0
    
    # CV Thresholds
    CV_MODERATE: float = 0.25
    CV_HIGH: float = 0.50
    
    # Burn Rate Thresholds
    BURN_RATE_WARNING: float = 0.10
    BURN_RATE_HIGH: float = 0.20
    BURN_RATE_CRITICAL: float = 0.35
    
    # Data Quality Confidence Thresholds
    CONFIDENCE_MEDIUM: float = 0.70
    CONFIDENCE_HIGH: float = 0.90

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
