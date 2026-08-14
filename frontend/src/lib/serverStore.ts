import type { MeetingDetail, MeetingListItem, ActionItem } from "@/types";

const INITIAL_MEETINGS: MeetingDetail[] = [
  {
    id: 1,
    title: "Q1 Product Roadmap Review",
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    duration_seconds: 2847,
    summary: `## Meeting Summary\n\nThe team reviewed the Q1 product roadmap and aligned on key priorities for the upcoming quarter.\n\n### Key Decisions\n• Launch the new dashboard redesign by March 15th\n• Prioritize mobile app performance improvements\n• Defer API v3 migration to Q2\n\n### Discussion Highlights\nSarah presented user research findings showing 73% of users want better search functionality. The team agreed to fast-track global search.\n\nMike raised capacity concerns and suggested hiring two frontend developers.\n\n### Next Steps\nThe product team will finalize the sprint plan by Friday and share with stakeholders.`,
    overview: "Quarterly roadmap review with product, engineering, and design teams.",
    audio_url: undefined,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    participants: [
      { id: 101, meeting_id: 1, name: "Sarah Chen", email: "sarah@company.com", avatar_color: "#7635FF" },
      { id: 102, meeting_id: 1, name: "Mike Johnson", email: "mike@company.com", avatar_color: "#00B894" },
      { id: 103, meeting_id: 1, name: "Emily Rodriguez", email: "emily@company.com", avatar_color: "#0984E3" },
      { id: 104, meeting_id: 1, name: "David Park", email: "david@company.com", avatar_color: "#E17055" },
    ],
    topics: [
      { id: 201, meeting_id: 1, title: "Opening & Agenda Review", start_time: 0, end_time: 180 },
      { id: 202, meeting_id: 1, title: "User Research Findings", start_time: 180, end_time: 720 },
      { id: 203, meeting_id: 1, title: "Engineering Capacity", start_time: 720, end_time: 1200 },
      { id: 204, meeting_id: 1, title: "Q1 Priorities & Timeline", start_time: 1200, end_time: 2100 },
      { id: 205, meeting_id: 1, title: "Action Items & Wrap-up", start_time: 2100, end_time: 2847 },
    ],
    transcript_segments: [
      { id: 301, meeting_id: 1, speaker_name: "Sarah Chen", start_time: 0, end_time: 15, text: "Good morning everyone. Thanks for joining the Q1 roadmap review. Let's start with a quick agenda overview." },
      { id: 302, meeting_id: 1, speaker_name: "Mike Johnson", start_time: 15, end_time: 32, text: "Sounds good. I have some concerns about our engineering capacity that I'd like to discuss." },
      { id: 303, meeting_id: 1, speaker_name: "Sarah Chen", start_time: 32, end_time: 58, text: "Absolutely, we'll get to that. First, let me share the user research findings from last month." },
      { id: 304, meeting_id: 1, speaker_name: "Sarah Chen", start_time: 58, end_time: 95, text: "We surveyed 500 users and found that 73% want better search functionality across the platform." },
      { id: 305, meeting_id: 1, speaker_name: "Emily Rodriguez", start_time: 95, end_time: 120, text: "That's consistent with what we've been hearing in support tickets. Search is our number one feature request." },
      { id: 306, meeting_id: 1, speaker_name: "David Park", start_time: 120, end_time: 155, text: "From a design perspective, I've been working on mockups for a unified search experience." },
      { id: 307, meeting_id: 1, speaker_name: "Sarah Chen", start_time: 155, end_time: 165, text: "Yes please, David. That would be great." },
      { id: 308, meeting_id: 1, speaker_name: "David Park", start_time: 165, end_time: 210, text: "So the concept is a command-bar style search that works across meetings, transcripts, and action items." },
      { id: 309, meeting_id: 1, speaker_name: "Mike Johnson", start_time: 210, end_time: 245, text: "I like the direction. But we need to be realistic about timeline. Our team is already stretched thin." },
    ],
    action_items: [
      { id: 401, meeting_id: 1, title: "Finalize sprint plan by Friday", description: undefined, assignee: "Emily Rodriguez", completed: false, due_date: undefined, created_at: new Date().toISOString() },
      { id: 402, meeting_id: 1, title: "Get design approval for dashboard redesign", description: undefined, assignee: "David Park", completed: false, due_date: undefined, created_at: new Date().toISOString() },
      { id: 403, meeting_id: 1, title: "Follow up with hiring team on frontend positions", description: undefined, assignee: "Mike Johnson", completed: true, due_date: undefined, created_at: new Date().toISOString() },
      { id: 404, meeting_id: 1, title: "Share user research deck with stakeholders", description: undefined, assignee: "Sarah Chen", completed: false, due_date: undefined, created_at: new Date().toISOString() },
    ],
  },
  {
    id: 2,
    title: "Engineering Standup - Sprint 24",
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    duration_seconds: 900,
    summary: `## Daily Standup Summary\n\nQuick sync on Sprint 24 progress. Team is on track for the release candidate.\n\n### Blockers\n• CI pipeline flaky tests blocking merge to main\n• Staging environment needs database migration\n\n### Progress Updates\n• Authentication refactor: 90% complete\n• New notification system: In QA\n• Bug fixes: 12 of 15 resolved`,
    overview: "Daily engineering standup for Sprint 24.",
    audio_url: undefined,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    participants: [
      { id: 105, meeting_id: 2, name: "Alex Turner", email: "alex@company.com", avatar_color: "#FDCB6E" },
      { id: 106, meeting_id: 2, name: "Priya Sharma", email: "priya@company.com", avatar_color: "#A29BFE" },
      { id: 107, meeting_id: 2, name: "James Wilson", email: "james@company.com", avatar_color: "#FD79A8" },
    ],
    topics: [
      { id: 206, meeting_id: 2, title: "Sprint Progress Updates", start_time: 0, end_time: 400 },
      { id: 207, meeting_id: 2, title: "Blockers Discussion", start_time: 400, end_time: 650 },
      { id: 208, meeting_id: 2, title: "Release Planning", start_time: 650, end_time: 900 },
    ],
    transcript_segments: [
      { id: 310, meeting_id: 2, speaker_name: "Alex Turner", start_time: 0, end_time: 20, text: "Morning team. Let's do a quick round. Finished the auth token refresh logic yesterday." },
      { id: 311, meeting_id: 2, speaker_name: "Priya Sharma", start_time: 20, end_time: 45, text: "I completed the notification webhook integration. It's in QA now." },
      { id: 312, meeting_id: 2, speaker_name: "James Wilson", start_time: 45, end_time: 75, text: "I'm blocked on the CI pipeline. Flaky integration tests are failing randomly." },
    ],
    action_items: [
      { id: 405, meeting_id: 2, title: "Debug and fix flaky CI tests", description: undefined, assignee: "James Wilson", completed: false, due_date: undefined, created_at: new Date().toISOString() },
      { id: 406, meeting_id: 2, title: "Run staging database migration", description: undefined, assignee: "Alex Turner", completed: false, due_date: undefined, created_at: new Date().toISOString() },
      { id: 407, meeting_id: 2, title: "Complete remaining 3 bug fixes", description: undefined, assignee: "James Wilson", completed: false, due_date: undefined, created_at: new Date().toISOString() },
    ],
  },
  {
    id: 3,
    title: "Customer Success - Enterprise Onboarding",
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
    duration_seconds: 3600,
    summary: `## Enterprise Client Onboarding Call\n\nOnboarding session with Acme Corp (500 seats) for enterprise deployment.\n\n### Client Requirements\n• SSO integration with Okta\n• Custom branding on meeting pages\n• Dedicated success manager\n• 99.9% uptime SLA`,
    overview: "Enterprise onboarding call with Acme Corp for 500-seat deployment.",
    audio_url: undefined,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    participants: [
      { id: 108, meeting_id: 3, name: "Lisa Morgan", email: "lisa@company.com", avatar_color: "#7635FF" },
      { id: 109, meeting_id: 3, name: "Tom Baker", email: "tom@company.com", avatar_color: "#00B894" },
      { id: 110, meeting_id: 3, name: "Jennifer Walsh", email: "jwalsh@acmecorp.com", avatar_color: "#0984E3" },
    ],
    topics: [
      { id: 209, meeting_id: 3, title: "Introductions & Requirements", start_time: 0, end_time: 600 },
      { id: 210, meeting_id: 3, title: "SSO & Security Setup", start_time: 600, end_time: 1500 },
    ],
    transcript_segments: [
      { id: 313, meeting_id: 3, speaker_name: "Lisa Morgan", start_time: 0, end_time: 30, text: "Welcome Jennifer and Robert. Excited to get Acme Corp onboarded." },
      { id: 314, meeting_id: 3, speaker_name: "Jennifer Walsh", start_time: 30, end_time: 65, text: "Thanks Lisa. Our main priority is SSO with Okta." },
    ],
    action_items: [
      { id: 408, meeting_id: 3, title: "Send Okta metadata URL to Tom", description: undefined, assignee: "Robert Kim", completed: true, due_date: undefined, created_at: new Date().toISOString() },
      { id: 409, meeting_id: 3, title: "Schedule training sessions for 3 time zones", description: undefined, assignee: "Lisa Morgan", completed: false, due_date: undefined, created_at: new Date().toISOString() },
    ],
  },
  {
    id: 4,
    title: "Design Review - Mobile App v2",
    date: new Date(Date.now() - 6 * 86400000).toISOString(),
    duration_seconds: 2700,
    summary: `## Mobile App v2 Design Review\n\nComprehensive review of the mobile app redesign mockups and user flow improvements.\n\n### Design Changes\n• Bottom navigation with 4 tabs\n• Redesigned meeting list with swipe actions\n• New audio player with waveform visualization`,
    overview: "Design review session for mobile app version 2 redesign.",
    audio_url: undefined,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    participants: [
      { id: 111, meeting_id: 4, name: "David Park", email: "david@company.com", avatar_color: "#E17055" },
      { id: 112, meeting_id: 4, name: "Sarah Chen", email: "sarah@company.com", avatar_color: "#7635FF" },
      { id: 113, meeting_id: 4, name: "Alex Turner", email: "alex@company.com", avatar_color: "#FDCB6E" },
    ],
    topics: [
      { id: 211, meeting_id: 4, title: "Navigation & Layout Changes", start_time: 0, end_time: 800 },
      { id: 212, meeting_id: 4, title: "Meeting List Redesign", start_time: 800, end_time: 1600 },
    ],
    transcript_segments: [
      { id: 315, meeting_id: 4, speaker_name: "David Park", start_time: 0, end_time: 35, text: "Alright, let's walk through the mobile v2 designs. Starting with the new bottom navigation." },
      { id: 316, meeting_id: 4, speaker_name: "Sarah Chen", start_time: 35, end_time: 70, text: "Much better! The old navigation was confusing for new users." },
    ],
    action_items: [
      { id: 410, meeting_id: 4, title: "Deliver final Figma files by Friday", description: undefined, assignee: "David Park", completed: true, due_date: undefined, created_at: new Date().toISOString() },
      { id: 411, meeting_id: 4, title: "Implement haptic feedback on swipe actions", description: undefined, assignee: "Alex Turner", completed: false, due_date: undefined, created_at: new Date().toISOString() },
    ],
  },
  {
    id: 5,
    title: "All Hands - Company Update",
    date: new Date(Date.now() - 10 * 86400000).toISOString(),
    duration_seconds: 4500,
    summary: `## All Hands Meeting Summary\n\nMonthly company-wide update covering Q4 results, team growth, and 2026 vision.\n\n### Q4 Highlights\n• Revenue grew 45% quarter-over-quarter\n• Customer count exceeded 10,000\n• NPS score improved to 72`,
    overview: "Monthly all-hands with company updates and 2026 vision.",
    audio_url: undefined,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    participants: [
      { id: 114, meeting_id: 5, name: "Mark Stevens", email: "mark@company.com", avatar_color: "#55EFC4" },
      { id: 115, meeting_id: 5, name: "Sarah Chen", email: "sarah@company.com", avatar_color: "#7635FF" },
      { id: 116, meeting_id: 5, name: "Mike Johnson", email: "mike@company.com", avatar_color: "#00B894" },
    ],
    topics: [
      { id: 213, meeting_id: 5, title: "Q4 Results & Metrics", start_time: 0, end_time: 1200 },
      { id: 214, meeting_id: 5, title: "Product Launch Recap", start_time: 1200, end_time: 2400 },
    ],
    transcript_segments: [
      { id: 317, meeting_id: 5, speaker_name: "Mark Stevens", start_time: 0, end_time: 40, text: "Welcome everyone to our monthly all-hands. What a quarter we've had!" },
      { id: 318, meeting_id: 5, speaker_name: "Sarah Chen", start_time: 40, end_time: 80, text: "On the product side, we shipped global search and real-time collaboration." },
    ],
    action_items: [
      { id: 412, meeting_id: 5, title: "Finalize EMEA enterprise sales hiring plan", description: undefined, assignee: "Mark Stevens", completed: false, due_date: undefined, created_at: new Date().toISOString() },
    ],
  },
  {
    id: 6,
    title: "Sales Pipeline Review - Q1",
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    duration_seconds: 2400,
    summary: `## Sales Pipeline Summary\n\nWeekly review of the Q1 sales pipeline with the revenue team.\n\n### Pipeline Status\n• Total pipeline value: $2.4M across 34 opportunities\n• 8 deals in final negotiation stage`,
    overview: "Weekly sales pipeline review covering Q1 opportunities and forecast.",
    audio_url: undefined,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    participants: [
      { id: 117, meeting_id: 6, name: "Rachel Adams", email: "rachel@company.com", avatar_color: "#FD79A8" },
      { id: 118, meeting_id: 6, name: "Tom Baker", email: "tom@company.com", avatar_color: "#00B894" },
    ],
    topics: [
      { id: 215, meeting_id: 6, title: "Pipeline Overview", start_time: 0, end_time: 600 },
    ],
    transcript_segments: [
      { id: 319, meeting_id: 6, speaker_name: "Rachel Adams", start_time: 0, end_time: 25, text: "Good afternoon team. We're at $2.4 million across 34 active opportunities." },
    ],
    action_items: [
      { id: 413, meeting_id: 6, title: "Prepare TechStart custom demo", description: undefined, assignee: "Tom Baker", completed: false, due_date: undefined, created_at: new Date().toISOString() },
    ],
  },
  {
    id: 7,
    title: "UX Research Debrief - Onboarding Flow",
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    duration_seconds: 1800,
    summary: `## UX Research Debrief\n\nDebrief session on the latest onboarding usability study with 12 participants.\n\n### Key Findings\n• 67% of users couldn't find the meeting upload feature\n• Average time-to-first-meeting: 8.5 minutes (target: 3 minutes)`,
    overview: "Usability study debrief on new user onboarding experience.",
    audio_url: undefined,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    participants: [
      { id: 119, meeting_id: 7, name: "David Park", email: "david@company.com", avatar_color: "#E17055" },
      { id: 120, meeting_id: 7, name: "Emily Rodriguez", email: "emily@company.com", avatar_color: "#0984E3" },
    ],
    topics: [
      { id: 216, meeting_id: 7, title: "Key Findings", start_time: 0, end_time: 1000 },
    ],
    transcript_segments: [
      { id: 320, meeting_id: 7, speaker_name: "David Park", start_time: 0, end_time: 30, text: "Thanks for joining. 67% of participants couldn't find meeting upload without guidance." },
    ],
    action_items: [
      { id: 414, meeting_id: 7, title: "Deliver updated onboarding mockups by Friday", description: undefined, assignee: "David Park", completed: false, due_date: undefined, created_at: new Date().toISOString() },
    ],
  },
];

let globalMeetings: MeetingDetail[] = [...INITIAL_MEETINGS];
let nextId = 100;

export const serverStore = {
  getMeetings: (params?: { search?: string; sort_by?: string; date_from?: string; date_to?: string }): MeetingListItem[] => {
    let list = [...globalMeetings];

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q) ||
          m.participants.some((p) => p.name.toLowerCase().includes(q))
      );
    }

    if (params?.date_from) {
      const from = new Date(params.date_from).getTime();
      list = list.filter((m) => new Date(m.date).getTime() >= from);
    }
    if (params?.date_to) {
      const to = new Date(params.date_to).getTime();
      list = list.filter((m) => new Date(m.date).getTime() <= to);
    }

    if (params?.sort_by === "date_asc") {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (params?.sort_by === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return list.map((m) => ({
      id: m.id,
      title: m.title,
      date: m.date,
      duration_seconds: m.duration_seconds,
      participants: m.participants,
      action_items_count: m.action_items.length,
      completed_action_items_count: m.action_items.filter((a) => a.completed).length,
    }));
  },

  getMeeting: (id: number): MeetingDetail | undefined => {
    return globalMeetings.find((m) => m.id === id);
  },

  createMeeting: (data: any): MeetingDetail => {
    const id = ++nextId;
    const now = new Date().toISOString();
    const meeting: MeetingDetail = {
      id,
      title: data.title,
      date: data.date || now,
      duration_seconds: data.duration_seconds || 0,
      summary: data.summary || "Meeting summary",
      overview: data.overview || "Meeting overview",
      audio_url: data.audio_url || undefined,
      created_at: now,
      updated_at: now,
      participants: (data.participants || []).map((p: any) => ({
        id: ++nextId,
        meeting_id: id,
        name: p.name,
        email: p.email || undefined,
        avatar_color: p.avatar_color || "#7635FF",
      })),
      transcript_segments: (data.transcript_segments || []).map((s: any) => ({
        id: ++nextId,
        meeting_id: id,
        speaker_name: s.speaker_name,
        start_time: s.start_time,
        end_time: s.end_time,
        text: s.text,
      })),
      action_items: (data.action_items || []).map((a: any) => ({
        id: ++nextId,
        meeting_id: id,
        title: a.title,
        description: a.description || undefined,
        assignee: a.assignee || undefined,
        completed: a.completed || false,
        due_date: a.due_date || undefined,
        created_at: now,
      })),
      topics: (data.topics || []).map((t: any) => ({
        id: ++nextId,
        meeting_id: id,
        title: t.title,
        start_time: t.start_time,
        end_time: t.end_time || undefined,
      })),
    };
    globalMeetings.unshift(meeting);
    return meeting;
  },

  updateMeeting: (id: number, data: any): MeetingDetail | null => {
    const meeting = globalMeetings.find((m) => m.id === id);
    if (!meeting) return null;
    if (data.title !== undefined) meeting.title = data.title;
    if (data.date !== undefined) meeting.date = data.date;
    if (data.participants !== undefined) {
      meeting.participants = data.participants.map((p: any) => ({
        id: ++nextId,
        meeting_id: id,
        name: p.name,
        email: p.email || undefined,
        avatar_color: p.avatar_color || "#7635FF",
      }));
    }
    meeting.updated_at = new Date().toISOString();
    return meeting;
  },

  deleteMeeting: (id: number): boolean => {
    const idx = globalMeetings.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    globalMeetings.splice(idx, 1);
    return true;
  },

  createActionItem: (meetingId: number, data: any): ActionItem | null => {
    const meeting = globalMeetings.find((m) => m.id === meetingId);
    if (!meeting) return null;
    const item: ActionItem = {
      id: ++nextId,
      meeting_id: meetingId,
      title: data.title,
      description: data.description || undefined,
      assignee: data.assignee || undefined,
      completed: data.completed || false,
      due_date: data.due_date || undefined,
      created_at: new Date().toISOString(),
    };
    meeting.action_items.push(item);
    return item;
  },

  updateActionItem: (itemId: number, data: any): ActionItem | null => {
    for (const m of globalMeetings) {
      const item = m.action_items.find((a) => a.id === itemId);
      if (item) {
        if (data.title !== undefined) item.title = data.title;
        if (data.completed !== undefined) item.completed = data.completed;
        if (data.assignee !== undefined) item.assignee = data.assignee;
        return item;
      }
    }
    return null;
  },

  deleteActionItem: (itemId: number): boolean => {
    for (const m of globalMeetings) {
      const idx = m.action_items.findIndex((a) => a.id === itemId);
      if (idx !== -1) {
        m.action_items.splice(idx, 1);
        return true;
      }
    }
    return false;
  },
};
