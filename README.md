# Coach Dokyung (AI Academic Coach) 🎓🤖

**Coach Dokyung** is an intelligent academic assistant designed to help university students manage their schedules and stay motivated. Unlike a simple to-do list, Dokyung **reads your syllabus**, **plans your week**, and **chats with you proactively** to keep you on track.

> "A Sunbae (Senior) who takes care of everything from scheduling to mental support."

## 🌟 Key Features

### 1. 📄 Smart Syllabus Parsing (Layout-Aware)
- Upload your **PDF Syllabus**, and Dokyung extracts assignments, exams, and due dates automatically.
- Uses **Upstage Document Digitization API** to understand complex layouts and tables.
- **Interactive Review**: Preview extracted tasks and choose what to add to your calendar.

### 2. 📅 Visual Weekly Calendar
- A clean, sunset-themed calendar dashboard.
- **Status Tracking**: Mark tasks as `Todo`, `In Progress`, or `Done` with visual indicators.
- **Detail View**: Click any task to see full details and update its status.

### 3. 💬 Proactive AI Coach (Solar LLM)
- Chat with Dokyung about your schedule, stress, or career goals.
- **Agentic Actions**: "Add a study session tomorrow at 2pm" -> Dokyung actually **updates the database** and refreshes your calendar.
- **Memory**: Dokyung remembers your past conversations and context (using SQLite-based history).
- **Persona**: A supportive, polite, and sometimes witty "Sunbae" tone.

### 4. 🧠 Emotional Intelligence
- Analyzes your mood based on chat.
- Provides **Suggested Actions** (e.g., "Take a 10-minute walk", "Focus Timer") when you're stressed.

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: Fast and modern UI library.
- **TypeScript**: For type-safe code.
- **Tailwind CSS**: Beautiful, custom-designed UI (Sunset Theme).
- **Zustand**: Simple global state management.

### Backend
- **FastAPI (Python)**: High-performance async API.
- **SQLAlchemy (SQLite)**: Lightweight and reliable database (No complex setup required).
- **Pydantic**: Data validation.

### AI & Agents
- **Upstage Solar LLM**: Powering the chat intelligence.
- **Upstage Document AI**: For OCR and layout analysis of PDF files.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Upstage API Key

### 1. Clone the Repository
```bash
git clone https://github.com/awesometuna/AICoachDokyung.git
cd AICoachDokyung
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "UPSTAGE_API_KEY=your_api_key_here" > .env

# Run Server
uvicorn main:app --reload
```
*Server runs at `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Client runs at `http://localhost:5173`*

---

## 📂 Project Structure
```
AICoachDokyung/
├── backend/            # FastAPI Server
│   ├── models/         # Database Models (Task, Message, User)
│   ├── services/       # AI Services (OCR, Chat)
│   ├── database/       # DB Connection
│   └── main.py         # Entry Point
│
├── frontend/           # React App
│   ├── src/
│   │   ├── components/ # UI Components (Calendar, Chat, Upload)
│   │   ├── services/   # API Client
│   │   └── store/      # State Management
│   └── tailwind.config.js
```

## 📝 License
This project is for educational and hackathon purposes.

---
Made with ❤️ by **Won & Agent Antigravity**
