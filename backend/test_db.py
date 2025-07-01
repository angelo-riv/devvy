from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

url = "postgresql+psycopg2://postgres.pbswjivayybejxqxasbx:Cascade!@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"

print("Attempting to connect to DB...")

try:
    engine = create_engine(url, connect_args={"connect_timeout": 5})  # 5 second timeout
    with engine.connect() as conn:
        print("✅ Successfully connected to DB")
except OperationalError as e:
    print("❌ DB connection failed:", e)
except Exception as e:
    print("❌ Unexpected error:", e)
