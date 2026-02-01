from sqlalchemy import Column, Integer, String, Boolean, DateTime
from database.database import Base
from datetime import datetime

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    due_date = Column(DateTime, nullable=True)
    is_completed = Column(Boolean, default=False)
    status = Column(String, default="todo") # todo, in_progress, done
    created_at = Column(DateTime, default=datetime.utcnow)
