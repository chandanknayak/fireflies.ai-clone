export interface Participant {
  id: number;
  meeting_id: number;
  name: string;
  email?: string;
  avatar_color: string;
}

export interface TranscriptSegment {
  id: number;
  meeting_id: number;
  speaker_name: string;
  start_time: number;
  end_time: number;
  text: string;
}

export interface ActionItem {
  id: number;
  meeting_id: number;
  title: string;
  description?: string;
  assignee?: string;
  completed: boolean;
  due_date?: string;
  created_at: string;
}

export interface Topic {
  id: number;
  meeting_id: number;
  title: string;
  start_time: number;
  end_time?: number;
}

export interface MeetingListItem {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  participants: Participant[];
  action_items_count: number;
  completed_action_items_count: number;
}

export interface MeetingDetail {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  summary: string;
  overview: string;
  audio_url?: string;
  created_at: string;
  updated_at: string;
  participants: Participant[];
  transcript_segments: TranscriptSegment[];
  action_items: ActionItem[];
  topics: Topic[];
}

export interface MeetingCreate {
  title: string;
  date: string;
  duration_seconds?: number;
  summary?: string;
  overview?: string;
  participants?: { name: string; email?: string }[];
  transcript_segments?: Omit<TranscriptSegment, "id" | "meeting_id">[];
}

export interface MeetingUpdate {
  title?: string;
  date?: string;
  duration_seconds?: number;
  summary?: string;
  overview?: string;
  participants?: { name: string; email?: string }[];
}

export interface ActionItemCreate {
  title: string;
  description?: string;
  assignee?: string;
  completed?: boolean;
}

export interface ActionItemUpdate {
  title?: string;
  description?: string;
  assignee?: string;
  completed?: boolean;
}

export interface TranscriptUpload {
  transcript_text: string;
  title?: string;
  date?: string;
}

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
