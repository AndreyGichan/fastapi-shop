from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    supabase_bucket: str

    class Config:
        env_file = ".env"


settings = Settings() # type: ignore