import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, SessionLocal, engine
from .routers import action_items, meetings
from .seed import seed_database

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fireflies Clone API",
    description="Meeting notes and transcription platform API",
    version="1.0.0",
)

raw_cors_origins = os.getenv("CORS_ORIGINS")
if raw_cors_origins and raw_cors_origins.strip() != "*":
    _cors_origins = [o.strip() for o in raw_cors_origins.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"https?://.*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(meetings.router, prefix="/api")
app.include_router(action_items.router, prefix="/api")


@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "fireflies-clone-api"}
