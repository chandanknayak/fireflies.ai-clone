import re
from datetime import datetime
from datetime import datetime
from typing import Optional

from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload

from . import models, schemas

AVATAR_COLORS = ["#7635FF", "#00B894", "#0984E3", "#E17055", "#FDCB6E", "#A29BFE", "#FD79A8", "#55EFC4"]


def _generate_summary_from_transcript(segments: list[models.TranscriptSegment]) -> tuple[str, str]:
    if not segments:
        return "No transcript available.", ""

    speakers = list(dict.fromkeys(s.speaker_name for s in segments))
    total_words = sum(len(s.text.split()) for s in segments)
    speaker_lines: dict[str, list[str]] = {}
    for seg in segments:
        speaker_lines.setdefault(seg.speaker_name, []).append(seg.text)

    overview = f"This {len(segments)}-segment meeting involved {len(speakers)} participant(s): {', '.join(speakers)}."
    summary_parts = [overview, "", "Key Discussion Points:"]
    for speaker in speakers[:4]:
        lines = speaker_lines.get(speaker, [])
        if lines:
            preview = " ".join(lines[:2])
            if len(preview) > 200:
                preview = preview[:200] + "..."
            summary_parts.append(f"• {speaker}: {preview}")

    summary_parts.extend(["", f"Total transcript length: ~{total_words} words."])
    return "\n".join(summary_parts), overview


def _extract_action_items(segments: list[models.TranscriptSegment]) -> list[schemas.ActionItemCreate]:
    action_patterns = [
        r"(?:will|should|need to|let's|going to)\s+(.{10,80})",
        r"(?:action item|todo|task):\s*(.{5,80})",
        r"(?:follow up|follow-up)\s+(?:on|with)\s+(.{5,80})",
    ]
    items: list[schemas.ActionItemCreate] = []
    seen: set[str] = set()
    for seg in segments:
        for pattern in action_patterns:
            for match in re.finditer(pattern, seg.text, re.IGNORECASE):
                title = match.group(1).strip().rstrip(".")
                key = title.lower()[:50]
                if key not in seen and len(title) > 8:
                    seen.add(key)
                    items.append(
                        schemas.ActionItemCreate(
                            title=title[0].upper() + title[1:],
                            assignee=seg.speaker_name,
                        )
                    )
    return items[:8]


def _extract_topics(segments: list[models.TranscriptSegment]) -> list[schemas.TopicCreate]:
    topics: list[schemas.TopicCreate] = []
    chunk_size = max(1, len(segments) // 5)
    for i in range(0, len(segments), chunk_size):
        chunk = segments[i : i + chunk_size]
        if not chunk:
            continue
        preview = chunk[0].text[:60].rsplit(" ", 1)[0] + "..."
        topics.append(
            schemas.TopicCreate(
                title=preview,
                start_time=chunk[0].start_time,
                end_time=chunk[-1].end_time,
            )
        )
    return topics


def parse_transcript_text(text: str) -> list[schemas.TranscriptSegmentCreate]:
    segments: list[schemas.TranscriptSegmentCreate] = []
    lines = text.strip().split("\n")
    current_time = 0.0

    timestamp_pattern = re.compile(
        r"^(?:\[)?(\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?)\]?\s*(?:-\s*)?(?:\[)?(\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?)\]?\s*(.+)$"
    )
    speaker_pattern = re.compile(r"^(.+?):\s*(.+)$")

    def parse_time(t: str) -> float:
        parts = t.split(":")
        if len(parts) == 2:
            return int(parts[0]) * 60 + float(parts[1])
        if len(parts) == 3:
            return int(parts[0]) * 3600 + int(parts[1]) * 60 + float(parts[2])
        return 0.0

    for line in lines:
        line = line.strip()
        if not line:
            continue

        ts_match = timestamp_pattern.match(line)
        if ts_match:
            start = parse_time(ts_match.group(1))
            end = parse_time(ts_match.group(2)) if ts_match.group(2) else start + 5
            rest = ts_match.group(3)
            sp_match = speaker_pattern.match(rest)
            if sp_match:
                segments.append(
                    schemas.TranscriptSegmentCreate(
                        speaker_name=sp_match.group(1).strip(),
                        start_time=start,
                        end_time=end,
                        text=sp_match.group(2).strip(),
                    )
                )
            else:
                segments.append(
                    schemas.TranscriptSegmentCreate(
                        speaker_name="Unknown",
                        start_time=start,
                        end_time=end,
                        text=rest.strip(),
                    )
                )
            current_time = end
            continue

        sp_match = speaker_pattern.match(line)
        if sp_match:
            segments.append(
                schemas.TranscriptSegmentCreate(
                    speaker_name=sp_match.group(1).strip(),
                    start_time=current_time,
                    end_time=current_time + 5,
                    text=sp_match.group(2).strip(),
                )
            )
            current_time += 5

    return segments


def get_meetings(
    db: Session,
    search: Optional[str] = None,
    sort_by: str = "date_desc",
    participant: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
) -> list[models.Meeting]:
    query = db.query(models.Meeting).options(
        joinedload(models.Meeting.participants),
        joinedload(models.Meeting.action_items),
    )

    if search:
        search_filter = f"%{search}%"
        participant_meeting_ids = select(models.Participant.meeting_id).where(
            models.Participant.name.ilike(search_filter)
        )
        query = query.filter(
            or_(
                models.Meeting.title.ilike(search_filter),
                models.Meeting.summary.ilike(search_filter),
                models.Meeting.id.in_(participant_meeting_ids),
            )
        )

    if participant:
        query = query.join(models.Participant).filter(models.Participant.name.ilike(f"%{participant}%"))

    if date_from:
        query = query.filter(models.Meeting.date >= date_from)
    if date_to:
        query = query.filter(models.Meeting.date <= date_to)

    if sort_by == "date_asc":
        query = query.order_by(models.Meeting.date.asc())
    elif sort_by == "title":
        query = query.order_by(models.Meeting.title.asc())
    else:
        query = query.order_by(models.Meeting.date.desc())

    return query.all()


def get_meeting(db: Session, meeting_id: int) -> Optional[models.Meeting]:
    return (
        db.query(models.Meeting)
        .options(
            joinedload(models.Meeting.participants),
            joinedload(models.Meeting.transcript_segments),
            joinedload(models.Meeting.action_items),
            joinedload(models.Meeting.topics),
        )
        .filter(models.Meeting.id == meeting_id)
        .first()
    )


def create_meeting(db: Session, meeting: schemas.MeetingCreate) -> models.Meeting:
    db_meeting = models.Meeting(
        title=meeting.title,
        date=meeting.date,
        duration_seconds=meeting.duration_seconds,
        summary=meeting.summary,
        overview=meeting.overview,
        audio_url=meeting.audio_url,
    )
    db.add(db_meeting)
    db.flush()

    for i, p in enumerate(meeting.participants):
        color = p.avatar_color or AVATAR_COLORS[i % len(AVATAR_COLORS)]
        db.add(models.Participant(meeting_id=db_meeting.id, name=p.name, email=p.email, avatar_color=color))

    for seg in meeting.transcript_segments:
        db.add(
            models.TranscriptSegment(
                meeting_id=db_meeting.id,
                speaker_name=seg.speaker_name,
                start_time=seg.start_time,
                end_time=seg.end_time,
                text=seg.text,
            )
        )

    for item in meeting.action_items:
        db.add(
            models.ActionItem(
                meeting_id=db_meeting.id,
                title=item.title,
                description=item.description,
                assignee=item.assignee,
                completed=item.completed,
                due_date=item.due_date,
            )
        )

    for topic in meeting.topics:
        db.add(
            models.Topic(
                meeting_id=db_meeting.id,
                title=topic.title,
                start_time=topic.start_time,
                end_time=topic.end_time,
            )
        )

    db.commit()
    db.refresh(db_meeting)
    return get_meeting(db, db_meeting.id)


def create_meeting_from_transcript(
    db: Session,
    transcript_text: str,
    title: Optional[str] = None,
    date: Optional[datetime] = None,
) -> models.Meeting:
    segments = parse_transcript_text(transcript_text)
    if not segments:
        raise ValueError("Could not parse transcript. Use format: 'Speaker Name: text' or '[00:00 - 00:05] Speaker: text'")

    speakers = list(dict.fromkeys(s.speaker_name for s in segments))
    duration = int(max(s.end_time for s in segments))

    segment_models = [
        models.TranscriptSegment(
            speaker_name=s.speaker_name,
            start_time=s.start_time,
            end_time=s.end_time,
            text=s.text,
        )
        for s in segments
    ]
    summary, overview = _generate_summary_from_transcript(segment_models)
    action_items = _extract_action_items(segment_models)
    topics = _extract_topics(segment_models)

    meeting_data = schemas.MeetingCreate(
        title=title or f"Meeting on {date.strftime('%b %d, %Y') if date else datetime.utcnow().strftime('%b %d, %Y')}",
        date=date or datetime.utcnow(),
        duration_seconds=duration,
        summary=summary,
        overview=overview,
        participants=[schemas.ParticipantCreate(name=s) for s in speakers],
        transcript_segments=segments,
        action_items=action_items,
        topics=topics,
    )
    return create_meeting(db, meeting_data)


def update_meeting(db: Session, meeting_id: int, meeting_update: schemas.MeetingUpdate) -> Optional[models.Meeting]:
    db_meeting = get_meeting(db, meeting_id)
    if not db_meeting:
        return None

    update_data = meeting_update.model_dump(exclude_unset=True, exclude={"participants"})
    for field, value in update_data.items():
        setattr(db_meeting, field, value)

    if meeting_update.participants is not None:
        db.query(models.Participant).filter(models.Participant.meeting_id == meeting_id).delete()
        for i, p in enumerate(meeting_update.participants):
            color = p.avatar_color or AVATAR_COLORS[i % len(AVATAR_COLORS)]
            db.add(models.Participant(meeting_id=meeting_id, name=p.name, email=p.email, avatar_color=color))

    db_meeting.updated_at = datetime.utcnow()
    db.commit()
    return get_meeting(db, meeting_id)


def delete_meeting(db: Session, meeting_id: int) -> bool:
    db_meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not db_meeting:
        return False
    db.delete(db_meeting)
    db.commit()
    return True


def create_action_item(db: Session, meeting_id: int, item: schemas.ActionItemCreate) -> Optional[models.ActionItem]:
    if not db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first():
        return None
    db_item = models.ActionItem(meeting_id=meeting_id, **item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_action_item(db: Session, item_id: int, item_update: schemas.ActionItemUpdate) -> Optional[models.ActionItem]:
    db_item = db.query(models.ActionItem).filter(models.ActionItem.id == item_id).first()
    if not db_item:
        return None
    for field, value in item_update.model_dump(exclude_unset=True).items():
        setattr(db_item, field, value)
    db.commit()
    db.refresh(db_item)
    return db_item


def delete_action_item(db: Session, item_id: int) -> bool:
    db_item = db.query(models.ActionItem).filter(models.ActionItem.id == item_id).first()
    if not db_item:
        return False
    db.delete(db_item)
    db.commit()
    return True
