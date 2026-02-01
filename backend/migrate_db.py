from sqlalchemy import create_engine, text
import os

# Database URL
DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(DATABASE_URL)

def migrate():
    with engine.connect() as connection:
        try:
            # Check if column exists
            result = connection.execute(text("PRAGMA table_info(tasks)"))
            columns = [row[1] for row in result.fetchall()]
            
            if "status" not in columns:
                print("Adding 'status' column to 'tasks' table...")
                connection.execute(text("ALTER TABLE tasks ADD COLUMN status VARCHAR DEFAULT 'todo'"))
                print("Migration successful.")
            else:
                print("'status' column already exists.")
        except Exception as e:
            print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
