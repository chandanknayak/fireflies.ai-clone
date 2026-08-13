from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/action-items", tags=["action-items"])


@router.post("/meetings/{meeting_id}", response_model=schemas.ActionItemResponse, status_code=201)
def create_action_item(meeting_id: int, item: schemas.ActionItemCreate, db: Session = Depends(get_db)):
    created = crud.create_action_item(db, meeting_id, item)
    if not created:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return created


@router.put("/{item_id}", response_model=schemas.ActionItemResponse)
def update_action_item(item_id: int, item: schemas.ActionItemUpdate, db: Session = Depends(get_db)):
    updated = crud.update_action_item(db, item_id, item)
    if not updated:
        raise HTTPException(status_code=404, detail="Action item not found")
    return updated


@router.delete("/{item_id}", response_model=schemas.MessageResponse)
def delete_action_item(item_id: int, db: Session = Depends(get_db)):
    if not crud.delete_action_item(db, item_id):
        raise HTTPException(status_code=404, detail="Action item not found")
    return schemas.MessageResponse(message="Action item deleted successfully")
