from fastapi import FastAPI
from database import init_db
from routes import router

# BUG #7: No CORSMiddleware — frontend (localhost:5173) will be blocked by browser
# CORS policy, OR if added carelessly, it would allow every origin (*).
app = FastAPI(title="Note Manager API")

app.include_router(router)


@app.on_event("startup")
def startup():
    init_db()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
