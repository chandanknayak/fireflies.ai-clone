# Fireflies.ai Clone — Meeting Notes & Transcription Platform

A full-stack clone of [Fireflies.ai](https://fireflies.ai) that replicates its design, user experience, and core post-meeting workflows. Browse meetings, view interactive transcripts with speaker labels, read AI-generated summaries, manage action items, and search across transcripts.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Tech Stack](https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi)
![Tech Stack](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite)

## Live Demo

> Deploy the application and add your hosted link here.

## Features

### Core (Implemented)
- **Meetings Library** — Dashboard with search, filter by participant, and sort by recency/title
- **Interactive Transcript** — Speaker labels, timestamps, click-to-seek sync with media player
- **AI Summary & Notes** — Seeded summaries, action items, topics/chapters
- **Meeting CRUD** — Create (form or transcript upload), edit metadata, delete meetings
- **Action Items** — Add, complete, and delete tasks per meeting
- **Transcript Search** — In-meeting search with highlighted matches
- **Fireflies UI** — Purple brand theme, sidebar navigation, two-panel notepad layout, toasts

### Placeholders (Coming Soon)
- Real-time bot joining live calls
- Actual speech-to-text transcription
- Integrations (Zoom, Google Meet, calendar, CRM)
- Team sharing & collaboration
- Real user authentication (default logged-in user assumed)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Python 3.11+, FastAPI |
| Database | SQLite with SQLAlchemy ORM |
| Fonts | Inter (body), DM Sans (headings) |

## Project Structure

```
fireflies.ai/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── database.py      # SQLAlchemy engine & session
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   ├── crud.py          # Database operations
│   │   ├── seed.py          # Sample data seeder
│   │   └── routers/
│   │       ├── meetings.py
│   │       └── action_items.py
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # React components
│   │   ├── context/         # Toast context provider
│   │   ├── lib/             # API client & utilities
│   │   └── types/           # TypeScript interfaces
│   └── package.json
└── README.md
```

## Database Schema

See **[backend/DATABASE.md](backend/DATABASE.md)** for the full ER diagram, table definitions, indexes, and design rationale.

```
meetings ──1:N── participants
         ──1:N── transcript_segments
         ──1:N── action_items
         ──1:N── topics
```

## API Overview

Base URL: `http://localhost:8000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/meetings` | List meetings (search, sort, filter) |
| GET | `/meetings/{id}` | Get meeting detail |
| POST | `/meetings` | Create meeting |
| POST | `/meetings/upload-transcript` | Create from transcript text |
| PUT | `/meetings/{id}` | Update meeting metadata |
| DELETE | `/meetings/{id}` | Delete meeting |
| POST | `/action-items/meetings/{id}` | Create action item |
| PUT | `/action-items/{id}` | Update action item |
| DELETE | `/action-items/{id}` | Delete action item |

### Query Parameters (GET /meetings)
- `search` — Filter by title, summary, or participant name
- `sort_by` — `date_desc` (default), `date_asc`, `title`
- `participant` — Filter by participant name
- `date_from` — ISO datetime, meetings on or after this date
- `date_to` — ISO datetime, meetings on or before this date

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python run.py
```

The API starts at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

On first startup, the database is created and seeded with 5 sample meetings.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts at `http://localhost:3000`.

### Environment Variables

Create `frontend/.env.local` (optional):

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Architecture

```
┌──────────────┐     HTTP/REST      ┌──────────────┐     SQLAlchemy     ┌──────────┐
│   Next.js    │ ◄──────────────► │   FastAPI    │ ◄────────────────► │  SQLite  │
│  Frontend    │   JSON API       │   Backend    │    ORM             │  DB      │
└──────────────┘                   └──────────────┘                    └──────────┘
```

- **Frontend** handles all UI rendering, state management, and API calls via a typed client
- **Backend** provides RESTful endpoints with Pydantic validation and SQLAlchemy persistence
- **Transcript parsing** supports `Speaker: text` and `[MM:SS - MM:SS] Speaker: text` formats
- **Summary generation** is mocked — extracts speakers, key points, and action items from transcript text via regex patterns

## Assumptions

1. **No real authentication** — A default user (Jane Doe) is shown in the sidebar
2. **No real audio/video** — Media player is a functional placeholder with seek bar synced to transcript timestamps
3. **Mocked AI summaries** — Seeded for sample data; auto-generated from transcript on upload using pattern extraction
4. **Single-user workspace** — No multi-tenancy or team features
5. **CORS enabled** — Backend allows all origins for development convenience

## Sample Data

The seeder creates **7 meetings** with full transcripts, AI summaries, action items, and topic chapters:

1. Q1 Product Roadmap Review
2. Engineering Standup - Sprint 24
3. Customer Success - Enterprise Onboarding
4. Design Review - Mobile App v2
5. All Hands - Company Update
6. Sales Pipeline Review - Q1
7. UX Research Debrief - Onboarding Flow

To re-seed from scratch, delete `backend/fireflies.db` and restart the backend.

## Deployment

### Backend (Railway / Render)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Set NEXT_PUBLIC_API_URL to your deployed backend URL
```

## License

Built as an SDE Fullstack assignment. For evaluation purposes only.
