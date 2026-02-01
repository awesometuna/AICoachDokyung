from sqlalchemy import Column, Integer, String
from database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="User")
    target_career = Column(String, nullable=True)
