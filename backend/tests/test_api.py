import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_fireflies.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "fireflies-clone-api"}


def test_create_and_get_meeting():
    payload = {
        "title": "Test Sprint Planning",
        "date": "2026-08-14T10:00:00Z",
        "duration_seconds": 1800,
        "summary": "Sample summary text",
        "overview": "Sample overview text",
        "participants": [
            {"name": "Alice Green", "email": "alice@example.com"},
            {"name": "Bob Smith", "email": "bob@example.com"},
        ],
        "action_items": [
            {"title": "Setup test environment", "assignee": "Alice Green", "completed": False}
        ],
    }
    create_res = client.post("/api/meetings", json=payload)
    assert create_res.status_code == 201
    meeting = create_res.json()
    assert meeting["title"] == "Test Sprint Planning"
    assert len(meeting["participants"]) == 2
    assert len(meeting["action_items"]) == 1

    meeting_id = meeting["id"]
    get_res = client.get(f"/api/meetings/{meeting_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == meeting_id


def test_list_meetings_filtering_and_sorting():
    client.post(
        "/api/meetings",
        json={"title": "Alpha Meeting", "date": "2026-08-10T10:00:00Z", "participants": [{"name": "Charlie"}]},
    )
    client.post(
        "/api/meetings",
        json={"title": "Beta Sync", "date": "2026-08-12T10:00:00Z", "participants": [{"name": "David"}]},
    )

    list_res = client.get("/api/meetings?sort_by=title")
    assert list_res.status_code == 200
    titles = [m["title"] for m in list_res.json()]
    assert titles == ["Alpha Meeting", "Beta Sync"]

    search_res = client.get("/api/meetings?search=Beta")
    assert search_res.status_code == 200
    assert len(search_res.json()) == 1
    assert search_res.json()[0]["title"] == "Beta Sync"


def test_upload_transcript():
    transcript_text = """
    [00:00 - 00:10] Sarah: Welcome everyone to the quarterly review.
    [00:10 - 00:30] Mike: I will update the documentation before tomorrow.
    [00:30 - 00:45] Sarah: Let's follow up on the launch plan.
    """
    res = client.post(
        "/api/meetings/upload-transcript",
        json={"transcript_text": transcript_text, "title": "Transcript Test Meeting"},
    )
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "Transcript Test Meeting"
    assert len(data["transcript_segments"]) >= 3
    assert len(data["participants"]) >= 2
    assert len(data["action_items"]) >= 1


def test_update_and_delete_meeting():
    create_res = client.post(
        "/api/meetings",
        json={"title": "Original Title", "date": "2026-08-14T10:00:00Z"},
    )
    meeting_id = create_res.json()["id"]

    update_res = client.put(
        f"/api/meetings/{meeting_id}",
        json={"title": "Updated Title", "participants": [{"name": "New User"}]},
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Updated Title"
    assert len(update_res.json()["participants"]) == 1

    delete_res = client.delete(f"/api/meetings/{meeting_id}")
    assert delete_res.status_code == 200

    get_res = client.get(f"/api/meetings/{meeting_id}")
    assert get_res.status_code == 404


def test_action_items_crud():
    create_m = client.post(
        "/api/meetings",
        json={"title": "Action Item Meeting", "date": "2026-08-14T10:00:00Z"},
    )
    meeting_id = create_m.json()["id"]

    add_item_res = client.post(
        f"/api/action-items/meetings/{meeting_id}",
        json={"title": "Test Task 1", "assignee": "Dev"},
    )
    assert add_item_res.status_code == 201
    item_id = add_item_res.json()["id"]

    update_item_res = client.put(
        f"/api/action-items/{item_id}",
        json={"completed": True, "title": "Updated Task 1"},
    )
    assert update_item_res.status_code == 200
    assert update_item_res.json()["completed"] is True

    delete_item_res = client.delete(f"/api/action-items/{item_id}")
    assert delete_item_res.status_code == 200
