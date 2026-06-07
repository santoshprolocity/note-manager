# Note Manager

Full-stack app built with FastAPI + React. Covers:
- **Task 1**: Quote API
- **Task 2**: CRUD Notes Manager
- **Task 3**: JWT Authentication
- **Task 4**: Break & Fix (your job)
- **Task 5**: Quote Voting System (your job)

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/santoshprolocity/note-manager.git
cd note-manager
```

### 2. Create your working branch

Make a branch with your name so your changes are separate from `main`.

```bash
git checkout -b aarohi/break-and-fix
```

All your bug fixes and new feature work go on this branch.

### 3. Commit your changes as you go

```bash
git add .
git commit -m "fix: describe what you fixed"
```

Use short, descriptive commit messages — one commit per bug fix is a good habit.

### 4. Push your branch to GitHub

```bash
git push -u origin aarohi/break-and-fix
```

### 5. Open a Pull Request when done

This lets your mentor review the changes before merging into `main`.

---

## Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
python main.py
# API running at http://localhost:8000
# Swagger UI at http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## Deliverables

See the project spec document for full requirements.
