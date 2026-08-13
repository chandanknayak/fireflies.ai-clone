# Database Schema Documentation

## Overview

SQLite database with SQLAlchemy ORM. Normalized relational schema centered on `meetings` with one-to-many relationships to participants, transcript segments, action items, and topics/chapters.

## Entity Relationship Diagram

```
                    ┌─────────────────────────────────────┐
                    │              meetings               │
                    ├─────────────────────────────────────┤
                    │ id (PK)                             │
                    │ title, date, duration_seconds       │
                    │ summary, overview, audio_url        │
                    │ created_at, updated_at              │
                    └──────────┬──────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┬──────────────────┐
         │                     │                     │                  │
         ▼                     ▼                     ▼                  ▼
┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐  ┌─────────────┐
│  participants   │  │transcript_segments│  │ action_items │  │   topics    │
├─────────────────┤  ├──────────────────┤  ├──────────────┤  ├─────────────┤
│ id (PK)         │  │ id (PK)          │  │ id (PK)      │  │ id (PK)     │
│ meeting_id (FK) │  │ meeting_id (FK)  │  │ meeting_id   │  │ meeting_id  │
│ name, email     │  │ speaker_name     │  │ title        │  │ title       │
│ avatar_color    │  │ start_time       │  │ description  │  │ start_time  │
└─────────────────┘  │ end_time, text   │  │ assignee     │  │ end_time    │
                     └──────────────────┘  │ completed    │  └─────────────┘
                                            │ due_date     │
                                            └──────────────┘
```

## Tables

### meetings
Core entity. One row per recorded meeting.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | INTEGER | PK, AUTO | Unique identifier |
| title | VARCHAR(500) | NOT NULL | Meeting title |
| date | DATETIME | NOT NULL, INDEX | When the meeting occurred |
| duration_seconds | INTEGER | DEFAULT 0 | Length in seconds |
| summary | TEXT | | AI-generated markdown summary |
| overview | TEXT | | One-line description |
| audio_url | VARCHAR(1000) | NULL | Optional recording URL |
| created_at | DATETIME | | Record creation |
| updated_at | DATETIME | | Last metadata update |

### participants
Attendees linked to a meeting. Supports multiple participants per meeting.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | INTEGER | PK | Unique identifier |
| meeting_id | INTEGER | FK → meetings.id ON DELETE CASCADE, INDEX | Parent meeting |
| name | VARCHAR(255) | NOT NULL, INDEX | Display name |
| email | VARCHAR(255) | NULL | Contact email |
| avatar_color | VARCHAR(20) | | UI avatar color hex |

### transcript_segments
Ordered speech segments with speaker diarization and timestamps.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | INTEGER | PK | Unique identifier |
| meeting_id | INTEGER | FK → meetings.id ON DELETE CASCADE, INDEX | Parent meeting |
| speaker_name | VARCHAR(255) | NOT NULL | Speaker label |
| start_time | FLOAT | NOT NULL | Start offset (seconds) |
| end_time | FLOAT | NOT NULL | End offset (seconds) |
| text | TEXT | NOT NULL | Spoken content |

### action_items
Tasks extracted from or added to a meeting.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | INTEGER | PK | Unique identifier |
| meeting_id | INTEGER | FK → meetings.id ON DELETE CASCADE, INDEX | Parent meeting |
| title | VARCHAR(500) | NOT NULL | Task description |
| description | TEXT | NULL | Additional details |
| assignee | VARCHAR(255) | NULL | Responsible person |
| completed | BOOLEAN | DEFAULT FALSE | Completion status |
| due_date | DATETIME | NULL | Optional deadline |
| created_at | DATETIME | | Creation timestamp |

### topics
Chapter/outline markers for navigating long meetings.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | INTEGER | PK | Unique identifier |
| meeting_id | INTEGER | FK → meetings.id ON DELETE CASCADE, INDEX | Parent meeting |
| title | VARCHAR(500) | NOT NULL | Chapter title |
| start_time | FLOAT | NOT NULL | Chapter start (seconds) |
| end_time | FLOAT | NULL | Chapter end (seconds) |

## Design Decisions

1. **Normalized schema** — Participants and segments are separate tables (not JSON blobs) for queryability and referential integrity.
2. **Cascade deletes** — Deleting a meeting removes all related records automatically.
3. **Float timestamps** — Transcript segments use seconds (float) for sub-second seek precision in the media player.
4. **Speaker as string** — `speaker_name` on segments rather than FK to participants allows flexibility when diarization names don't match attendee list exactly.
5. **Summary on meeting** — Full markdown summary stored on the meeting row; topics provide navigable outline structure separately from action items.

## Indexes

| Index | Column(s) | Rationale |
|-------|-----------|-----------|
| ix_meetings_date | meetings.date | Sort/filter by recency |
| ix_participants_meeting_id | participants.meeting_id | Join participants to meetings |
| ix_participants_name | participants.name | Search/filter by participant |
| ix_transcript_segments_meeting_id | transcript_segments.meeting_id | Load transcript for detail view |
| ix_action_items_meeting_id | action_items.meeting_id | Load tasks per meeting |
| ix_topics_meeting_id | topics.meeting_id | Load chapters per meeting |

## Seed Data

On first startup, `seed.py` inserts **7 meetings** with full transcripts (8–20 segments each), markdown summaries, 3–5 action items, and 4–5 topic chapters per meeting. Data covers product, engineering, sales, design, and company-wide scenarios.
