from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/meetings", tags=["meetings"])


@router.get("", response_model=list[schemas.MeetingListItem])
def list_meetings(
    search: Optional[str] = Query(None),
    sort_by: str = Query("date_desc"),
    participant: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
):
    meetings = crud.get_meetings(
        db,
        search=search,
        sort_by=sort_by,
        participant=participant,
        date_from=date_from,
        date_to=date_to,
    )
    return [
        schemas.MeetingListItem(
            id=m.id,
            title=m.title,
            date=m.date,
            duration_seconds=m.duration_seconds,
            participants=m.participants,
            action_items_count=len(m.action_items),
            completed_action_items_count=sum(1 for a in m.action_items if a.completed),
        )
        for m in meetings
    ]


@router.get("/{meeting_id}", response_model=schemas.MeetingDetail)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.post("", response_model=schemas.MeetingDetail, status_code=201)
def create_meeting(meeting: schemas.MeetingCreate, db: Session = Depends(get_db)):
    return crud.create_meeting(db, meeting)


@router.post("/upload-transcript", response_model=schemas.MeetingDetail, status_code=201)
def upload_transcript(payload: schemas.TranscriptUpload, db: Session = Depends(get_db)):
    try:
        return crud.create_meeting_from_transcript(
            db,
            transcript_text=payload.transcript_text,
            title=payload.title,
            date=payload.date,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{meeting_id}", response_model=schemas.MeetingDetail)
def update_meeting(meeting_id: int, meeting: schemas.MeetingUpdate, db: Session = Depends(get_db)):
    updated = crud.update_meeting(db, meeting_id, meeting)
    if not updated:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return updated


@router.delete("/{meeting_id}", response_model=schemas.MessageResponse)
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    if not crud.delete_meeting(db, meeting_id):
        raise HTTPException(status_code=404, detail="Meeting not found")
    return schemas.MessageResponse(message="Meeting deleted successfully")
