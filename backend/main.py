from fastapi import FastAPI, UploadFile, File, Depends
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.database import Base, engine, get_db
from typing import Optional, List
from pydantic import BaseModel
import json
from models.task import Task
from models.user import User
from models.chat import ChatRequest, ChatResponse, UserProfileRequest
from services.ocr_service import parse_syllabus
from services.chat_service import get_ai_response
from datetime import datetime

# Create DB Tables (Tasks & Users)
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World from Coach Dokyung Backend"}

# --- Profile API ---
@app.post("/api/profile")
def update_profile(request: UserProfileRequest, db: Session = Depends(get_db)):
    # Simple MVP: Always update user ID 1
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        user = User(id=1, name=request.name, target_career=request.target_career)
        db.add(user)
    else:
        user.name = request.name
        user.target_career = request.target_career
    
    db.commit()
    return {"status": "success", "user": {"name": user.name, "target_career": user.target_career}}

@app.get("/api/profile")
def get_profile(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        return {"name": "", "target_career": ""}
    return {"name": user.name, "target_career": user.target_career}

# --- OCR API ---
@app.post("/api/parse/syllabus")
async def upload_syllabus(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()
    result = await parse_syllabus(content, file.filename)
    
    tasks_data = result.get("tasks_extracted", [])
    
    # Return extracted tasks for preview (Do not save yet)
    preview_tasks = []
    current_id_mock = 0
    for t in tasks_data:
        current_id_mock += 1
        # Simple date handling
        due_date_str = t.get("due_date")
        
        preview_tasks.append({
            "id": current_id_mock, # Temporary ID for frontend key
            "title": t["title"],
            "description": t["description"],
            "due_date": due_date_str, # String format for preview
            "status": "todo"
        })

    return {"filename": file.filename, "parsed": result, "tasks_preview": preview_tasks}

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

@app.get("/api/tasks")
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return tasks

@app.put("/api/tasks/{task_id}")
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return {"error": "Task not found"}
    
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.status is not None:
        task.status = task_update.status
        # Sync is_completed for backward compatibility
        if task.status == "done":
            task.is_completed = True
        else:
            task.is_completed = False

    db.commit()
    db.refresh(task) 
    return task

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[str] = None # YYYY-MM-DD
    status: Optional[str] = "todo"

@app.post("/api/tasks/batch")
def create_tasks_batch(tasks: List[TaskCreate], db: Session = Depends(get_db)):
    saved_tasks = []
    for t in tasks:
        due_date_obj = None
        if t.due_date:
            try:
                due_date_obj = datetime.strptime(t.due_date, "%Y-%m-%d")
            except:
                pass
        
        new_task = Task(title=t.title, description=t.description, due_date=due_date_obj, status=t.status, is_completed=False)
        db.add(new_task)
        saved_tasks.append(new_task)
    
    db.commit()
    # Refresh all? Not strictly necessary for batch unless returning full objects with IDs
    # Let's return success count
    return {"status": "success", "count": len(saved_tasks)}

from models.chat import ChatRequest, ChatResponse, UserProfileRequest, Message
from services.chat_service import get_ai_response
import json

# --- Chat API ---
@app.get("/api/chat/history")
def get_chat_history(db: Session = Depends(get_db)):
    # MVP: Fetch all messages for user_id 1 sorted by time
    messages = db.query(Message).filter(Message.user_id == 1).order_by(Message.created_at).all()
    
    history_data = []
    for msg in messages:
        # If content is JSON (from assistant), parse it to get 'message_to_user' for simple display?
        # Actually frontend expects 'ChatResponse' format for assistant?
        # Let's simplify: Return raw role/content, let frontend handle parsing.
        content = msg.content
        if msg.role == "assistant" and msg.is_json:
             try:
                 # We stored the full JSON response from AI.
                 # Frontend needs to know this.
                 pass
             except:
                 pass
        
        history_data.append({
            "id": msg.id,
            "role": msg.role,
            "content": content,
            "is_json": msg.is_json,
            "created_at": msg.created_at
        })
    return history_data

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_coach(request: ChatRequest, db: Session = Depends(get_db)):
    # 1. Save User Message
    user_msg = Message(user_id=1, role="user", content=request.message, is_json=False)
    db.add(user_msg)
    db.commit()
    
    # 2. Get User Context
    user = db.query(User).filter(User.id == 1).first()
    target_career = user.target_career if user else "Undecided"
    
    # 3. Fetch Recent History (for Context)
    # Get last 10 messages (including the one just saved)
    recent_msgs = db.query(Message).filter(Message.user_id == 1).order_by(Message.created_at.desc()).limit(10).all()
    recent_msgs.reverse() # Oldest to Newest
    
    history_context = []
    for m in recent_msgs:
        content_str = m.content
        # If assistant message is JSON, we might want to extract just the text for context? 
        # Or pass full JSON to see if LLM understands self?
        # Solar might prefer "text". Let's try passing the 'message_to_user' if JSON.
        if m.role == "assistant" and m.is_json:
            try:
                data = json.loads(m.content)
                content_str = data.get("message_to_user", "")
            except:
                pass
        
        history_context.append({"role": m.role, "content": content_str})
    
    # 4. Call AI
    ai_reply_json = await get_ai_response(request.message, target_career, history_context)
    
    # 5. Execute Server Action (if any)
    server_action = ai_reply_json.get("server_action")
    if server_action and server_action.get("action_type") == "create_task":
        data = server_action.get("data", {})
        title = data.get("title", "New Task")
        description = data.get("description", "Created by Coach Dokyung")
        due_date_str = data.get("due_date")
        
        due_date_obj = None
        if due_date_str:
            try:
                due_date_obj = datetime.strptime(due_date_str, "%Y-%m-%d")
            except:
                # Fallback: Create for today or ignore date
                pass
        
        new_task = Task(title=title, description=description, due_date=due_date_obj, is_completed=False)
        db.add(new_task)
        db.commit()
        # Note: We don't necessarily need to return the task, but user will fetch it via frontend refresh.

    # 6. Save AI Response
    ai_msg_content = json.dumps(ai_reply_json, ensure_ascii=False)
    ai_msg = Message(user_id=1, role="assistant", content=ai_msg_content, is_json=True)
    db.add(ai_msg)
    db.commit()
    
    return ChatResponse(**ai_reply_json)
