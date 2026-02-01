from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from database.database import Base

from datetime import datetime

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1)
    role = Column(String)  # 'user' or 'system' (though for system we store JSON string in content)
    content = Column(String) # For system, this will be the message text or JSON
    is_json = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatRequest(BaseModel):
    message: str
    user_id: int = 1  # For MVP, mostly single user

class SuggestedAction(BaseModel):
    title: str
    duration_min: int
    type: str  # start | rest | drop

class ServerAction(BaseModel):
    action_type: str  # e.g., 'create_task'
    data: dict        # e.g., {'title': 'Rest', 'due_date': '2026-02-02'}

class Analysis(BaseModel):
    emotion_intensity: int
    anxiety_theme: Optional[str] = None
    defense_mechanism: Optional[str] = None
    career_alignment_score: Optional[int] = None
    user_mood: str

class ChatResponse(BaseModel):
    analysis: Analysis
    coach_thought: str
    message_to_user: str
    suggested_action: Optional[SuggestedAction] = None
    server_action: Optional[ServerAction] = None

class UserProfileRequest(BaseModel):
    name: str
    target_career: str
