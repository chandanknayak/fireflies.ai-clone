from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ParticipantBase(BaseModel):
    name: str
    email: Optional[str] = None
    avatar_color: Optional[str] = "#6C5CE7"


class ParticipantCreate(ParticipantBase):
    pass


class ParticipantResponse(ParticipantBase):
    id: int
    meeting_id: int

    model_config = {"from_attributes": True}


class TranscriptSegmentBase(BaseModel):
    speaker_name: str
    start_time: float
    end_time: float
    text: str


class TranscriptSegmentCreate(TranscriptSegmentBase):
    pass


class TranscriptSegmentResponse(TranscriptSegmentBase):
    id: int
    meeting_id: int

    model_config = {"from_attributes": True}


class ActionItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    assignee: Optional[str] = None
    completed: bool = False
    due_date: Optional[datetime] = None


class ActionItemCreate(ActionItemBase):
    pass


class ActionItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assignee: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None


class ActionItemResponse(ActionItemBase):
    id: int
    meeting_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class TopicBase(BaseModel):
    title: str
    start_time: float
    end_time: Optional[float] = None


class TopicCreate(TopicBase):
    pass


class TopicResponse(TopicBase):
    id: int
    meeting_id: int

    model_config = {"from_attributes": True}


class MeetingBase(BaseModel):
    title: str
    date: datetime
    duration_seconds: int = 0
    summary: str = ""
    overview: str = ""
    audio_url: Optional[str] = None


class MeetingCreate(MeetingBase):
    participants: list[ParticipantCreate] = Field(default_factory=list)
    transcript_segments: list[TranscriptSegmentCreate] = Field(default_factory=list)
    action_items: list[ActionItemCreate] = Field(default_factory=list)
    topics: list[TopicCreate] = Field(default_factory=list)


class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    summary: Optional[str] = None
    overview: Optional[str] = None
    audio_url: Optional[str] = None
    participants: Optional[list[ParticipantCreate]] = None


class MeetingListItem(BaseModel):
    id: int
    title: str
    date: datetime
    duration_seconds: int
    participants: list[ParticipantResponse]
    action_items_count: int = 0
    completed_action_items_count: int = 0

    model_config = {"from_attributes": True}


class MeetingDetail(MeetingBase):
    id: int
    created_at: datetime
    updated_at: datetime
    participants: list[ParticipantResponse]
    transcript_segments: list[TranscriptSegmentResponse]
    action_items: list[ActionItemResponse]
    topics: list[TopicResponse]

    model_config = {"from_attributes": True}


class TranscriptUpload(BaseModel):
    transcript_text: str
    title: Optional[str] = None
    date: Optional[datetime] = None


class MessageResponse(BaseModel):
    message: str
