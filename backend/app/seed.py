from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from . import crud, models, schemas

AVATAR_COLORS = ["#7635FF", "#00B894", "#0984E3", "#E17055", "#FDCB6E", "#A29BFE"]


def seed_database(db: Session) -> None:
    if db.query(models.Meeting).count() > 0:
        return

    meetings_data = [
        {
            "title": "Q1 Product Roadmap Review",
            "date": datetime.utcnow() - timedelta(days=1),
            "duration_seconds": 2847,
            "summary": """## Meeting Summary

The team reviewed the Q1 product roadmap and aligned on key priorities for the upcoming quarter.

### Key Decisions
• Launch the new dashboard redesign by March 15th
• Prioritize mobile app performance improvements
• Defer API v3 migration to Q2

### Discussion Highlights
Sarah presented the user research findings showing 73% of users want better search functionality. The team agreed to fast-track the global search feature.

Mike raised concerns about engineering capacity and suggested hiring two additional frontend developers.

### Next Steps
The product team will finalize the sprint plan by Friday and share with stakeholders.""",
            "overview": "Quarterly roadmap review with product, engineering, and design teams.",
            "participants": [
                {"name": "Sarah Chen", "email": "sarah@company.com"},
                {"name": "Mike Johnson", "email": "mike@company.com"},
                {"name": "Emily Rodriguez", "email": "emily@company.com"},
                {"name": "David Park", "email": "david@company.com"},
            ],
            "topics": [
                {"title": "Opening & Agenda Review", "start_time": 0, "end_time": 180},
                {"title": "User Research Findings", "start_time": 180, "end_time": 720},
                {"title": "Engineering Capacity", "start_time": 720, "end_time": 1200},
                {"title": "Q1 Priorities & Timeline", "start_time": 1200, "end_time": 2100},
                {"title": "Action Items & Wrap-up", "start_time": 2100, "end_time": 2847},
            ],
            "transcript": [
                ("Sarah Chen", 0, 15, "Good morning everyone. Thanks for joining the Q1 roadmap review. Let's start with a quick agenda overview."),
                ("Mike Johnson", 15, 32, "Sounds good. I have some concerns about our engineering capacity that I'd like to discuss."),
                ("Sarah Chen", 32, 58, "Absolutely, we'll get to that. First, let me share the user research findings from last month."),
                ("Sarah Chen", 58, 95, "We surveyed 500 users and found that 73% want better search functionality across the platform."),
                ("Emily Rodriguez", 95, 120, "That's consistent with what we've been hearing in support tickets. Search is our number one feature request."),
                ("David Park", 120, 155, "From a design perspective, I've been working on mockups for a unified search experience. Should I walk through those?"),
                ("Sarah Chen", 155, 165, "Yes please, David. That would be great."),
                ("David Park", 165, 210, "So the concept is a command-bar style search that works across meetings, transcripts, and action items."),
                ("Mike Johnson", 210, 245, "I like the direction. But we need to be realistic about timeline. Our team is already stretched thin."),
                ("Mike Johnson", 245, 280, "We should follow up with the hiring team about those two frontend developer positions we requested."),
                ("Emily Rodriguez", 280, 310, "Agreed. In the meantime, let's prioritize. What's the must-have for Q1 versus nice-to-have?"),
                ("Sarah Chen", 310, 350, "Must-haves: dashboard redesign, global search MVP, and mobile performance fixes. API v3 can wait until Q2."),
                ("Mike Johnson", 350, 385, "I can commit to the dashboard redesign by March 15th if we deprioritize the analytics overhaul."),
                ("David Park", 385, 410, "Works for me. I'll need final design approval by end of this week to hit that date."),
                ("Sarah Chen", 410, 440, "Done. Emily, can you coordinate the sprint planning session for Friday?"),
                ("Emily Rodriguez", 440, 460, "Will do. I'll send out the calendar invite today."),
                ("Sarah Chen", 460, 480, "Great. Let's wrap up. Action items are in the notes. Thanks everyone!"),
            ],
            "action_items": [
                {"title": "Finalize sprint plan by Friday", "assignee": "Emily Rodriguez", "completed": False},
                {"title": "Get design approval for dashboard redesign", "assignee": "David Park", "completed": False},
                {"title": "Follow up with hiring team on frontend positions", "assignee": "Mike Johnson", "completed": True},
                {"title": "Share user research deck with stakeholders", "assignee": "Sarah Chen", "completed": False},
            ],
        },
        {
            "title": "Engineering Standup - Sprint 24",
            "date": datetime.utcnow() - timedelta(days=2),
            "duration_seconds": 900,
            "summary": """## Daily Standup Summary

Quick sync on Sprint 24 progress. Team is on track for the release candidate.

### Blockers
• CI pipeline flaky tests blocking merge to main
• Staging environment needs database migration

### Progress Updates
• Authentication refactor: 90% complete
• New notification system: In QA
• Bug fixes: 12 of 15 resolved

### Action Items
Fix CI pipeline and complete remaining bug fixes before Thursday's release.""",
            "overview": "Daily engineering standup for Sprint 24.",
            "participants": [
                {"name": "Alex Turner", "email": "alex@company.com"},
                {"name": "Priya Sharma", "email": "priya@company.com"},
                {"name": "James Wilson", "email": "james@company.com"},
            ],
            "topics": [
                {"title": "Sprint Progress Updates", "start_time": 0, "end_time": 400},
                {"title": "Blockers Discussion", "start_time": 400, "end_time": 650},
                {"title": "Release Planning", "start_time": 650, "end_time": 900},
            ],
            "transcript": [
                ("Alex Turner", 0, 20, "Morning team. Let's do a quick round. I'll start - finished the auth token refresh logic yesterday."),
                ("Priya Sharma", 20, 45, "I completed the notification webhook integration. It's in QA now, should hear back by EOD."),
                ("James Wilson", 45, 75, "I'm blocked on the CI pipeline. Those flaky integration tests are failing randomly on main."),
                ("Alex Turner", 75, 95, "I saw that. James, can you pair with me after standup to debug the test suite?"),
                ("James Wilson", 95, 110, "Yes, let's do that. I think it's a race condition in the database cleanup."),
                ("Priya Sharma", 110, 140, "Also, staging needs the migration run before we can test notifications end-to-end."),
                ("Alex Turner", 140, 165, "I'll run the migration right after our CI fix session. We need to follow up before Thursday's release."),
                ("James Wilson", 165, 185, "Agreed. We have 3 bug fixes left. I should be able to close them today."),
                ("Priya Sharma", 185, 200, "Great. Let's sync again tomorrow if anything comes up."),
            ],
            "action_items": [
                {"title": "Debug and fix flaky CI tests", "assignee": "James Wilson", "completed": False},
                {"title": "Run staging database migration", "assignee": "Alex Turner", "completed": False},
                {"title": "Complete remaining 3 bug fixes", "assignee": "James Wilson", "completed": False},
            ],
        },
        {
            "title": "Customer Success - Enterprise Onboarding",
            "date": datetime.utcnow() - timedelta(days=4),
            "duration_seconds": 3600,
            "summary": """## Enterprise Client Onboarding Call

Onboarding session with Acme Corp (500 seats) for enterprise deployment.

### Client Requirements
• SSO integration with Okta
• Custom branding on meeting pages
• Dedicated success manager
• 99.9% uptime SLA

### Agreed Timeline
• Week 1-2: SSO setup and testing
• Week 3: Custom branding implementation
• Week 4: User training sessions
• Week 5: Go-live

### Key Contacts
• Acme: Jennifer Walsh (VP Engineering)
• Our team: Lisa Morgan (CS Lead), Tom Baker (Solutions Engineer)""",
            "overview": "Enterprise onboarding call with Acme Corp for 500-seat deployment.",
            "participants": [
                {"name": "Lisa Morgan", "email": "lisa@company.com"},
                {"name": "Tom Baker", "email": "tom@company.com"},
                {"name": "Jennifer Walsh", "email": "jwalsh@acmecorp.com"},
                {"name": "Robert Kim", "email": "rkim@acmecorp.com"},
            ],
            "topics": [
                {"title": "Introductions & Requirements", "start_time": 0, "end_time": 600},
                {"title": "SSO & Security Setup", "start_time": 600, "end_time": 1500},
                {"title": "Custom Branding Discussion", "start_time": 1500, "end_time": 2400},
                {"title": "Training & Go-Live Plan", "start_time": 2400, "end_time": 3600},
            ],
            "transcript": [
                ("Lisa Morgan", 0, 30, "Welcome Jennifer and Robert. Excited to get Acme Corp onboarded. Let's review the implementation plan."),
                ("Jennifer Walsh", 30, 65, "Thanks Lisa. Our main priority is SSO with Okta. We need all 500 users authenticated through our identity provider."),
                ("Tom Baker", 65, 100, "We support SAML 2.0 and OIDC. I'll need your Okta metadata URL to configure the integration."),
                ("Robert Kim", 100, 130, "I can provide that today. We also need custom branding - our logo and colors on meeting pages."),
                ("Lisa Morgan", 130, 165, "Custom branding is included in your enterprise plan. Tom will send a branding questionnaire after this call."),
                ("Jennifer Walsh", 165, 200, "Perfect. What about the uptime SLA? Our compliance team requires 99.9% availability."),
                ("Lisa Morgan", 200, 235, "That's standard on enterprise. You'll get a dedicated status page and priority support channel."),
                ("Tom Baker", 235, 270, "For timeline, I'd suggest SSO first since it unblocks user provisioning. We can have that live in two weeks."),
                ("Robert Kim", 270, 300, "Two weeks works. We'll need to follow up with our IT team to configure the Okta app."),
                ("Jennifer Walsh", 300, 340, "Let's plan user training for week four. We have offices in three time zones."),
                ("Lisa Morgan", 340, 375, "We'll schedule three training sessions to cover all zones. I'll send proposed times this week."),
                ("Tom Baker", 375, 400, "Action item on my end: send the SSO setup guide and branding questionnaire by end of day."),
            ],
            "action_items": [
                {"title": "Send Okta metadata URL to Tom", "assignee": "Robert Kim", "completed": True},
                {"title": "Send SSO setup guide and branding questionnaire", "assignee": "Tom Baker", "completed": True},
                {"title": "Schedule training sessions for 3 time zones", "assignee": "Lisa Morgan", "completed": False},
                {"title": "Configure Okta app with IT team", "assignee": "Robert Kim", "completed": False},
            ],
        },
        {
            "title": "Design Review - Mobile App v2",
            "date": datetime.utcnow() - timedelta(days=6),
            "duration_seconds": 2700,
            "summary": """## Mobile App v2 Design Review

Comprehensive review of the mobile app redesign mockups and user flow improvements.

### Design Changes
• Bottom navigation with 4 tabs
• Redesigned meeting list with swipe actions
• New audio player with waveform visualization
• Dark mode support

### Feedback
• Team loved the new meeting cards design
• Concerns about waveform performance on older devices
• Requested haptic feedback on swipe actions

### Decision
Proceed with development. Waveform will use simplified version for devices with less than 4GB RAM.""",
            "overview": "Design review session for mobile app version 2 redesign.",
            "participants": [
                {"name": "David Park", "email": "david@company.com"},
                {"name": "Sarah Chen", "email": "sarah@company.com"},
                {"name": "Alex Turner", "email": "alex@company.com"},
            ],
            "topics": [
                {"title": "Navigation & Layout Changes", "start_time": 0, "end_time": 800},
                {"title": "Meeting List Redesign", "start_time": 800, "end_time": 1600},
                {"title": "Audio Player & Performance", "start_time": 1600, "end_time": 2300},
                {"title": "Next Steps", "start_time": 2300, "end_time": 2700},
            ],
            "transcript": [
                ("David Park", 0, 35, "Alright, let's walk through the mobile v2 designs. Starting with the new bottom navigation."),
                ("David Park", 35, 70, "We moved from a hamburger menu to four tabs: Home, Meetings, Search, and Profile."),
                ("Sarah Chen", 70, 95, "Much better. The old navigation was confusing for new users based on our usability tests."),
                ("David Park", 95, 130, "Next, the meeting list. Each card now shows title, date, duration, and participant avatars."),
                ("Alex Turner", 130, 160, "I like the swipe actions. Delete on left swipe, share on right. We'll need to implement haptic feedback."),
                ("David Park", 160, 195, "Good call on haptics. For the audio player, I've designed a waveform visualization synced with playback."),
                ("Alex Turner", 195, 230, "Waveforms could be heavy on older devices. We should use a simplified version for phones with less than 4GB RAM."),
                ("Sarah Chen", 230, 260, "Agreed. Can we A/B test the full waveform versus simplified version?"),
                ("David Park", 260, 290, "Yes, I'll add that to the spec. Dark mode is also included - auto-detects system preference."),
                ("Alex Turner", 290, 320, "From engineering side, we can start next sprint. Need final Figma files by Monday."),
                ("David Park", 320, 340, "You'll have them Friday. I'll also need to follow up on the icon assets for dark mode."),
            ],
            "action_items": [
                {"title": "Deliver final Figma files by Friday", "assignee": "David Park", "completed": True},
                {"title": "Implement haptic feedback on swipe actions", "assignee": "Alex Turner", "completed": False},
                {"title": "Set up A/B test for waveform vs simplified player", "assignee": "Alex Turner", "completed": False},
                {"title": "Prepare dark mode icon assets", "assignee": "David Park", "completed": False},
            ],
        },
        {
            "title": "All Hands - Company Update",
            "date": datetime.utcnow() - timedelta(days=10),
            "duration_seconds": 4500,
            "summary": """## All Hands Meeting Summary

Monthly company-wide update covering Q4 results, team growth, and 2026 vision.

### Q4 Highlights
• Revenue grew 45% quarter-over-quarter
• Customer count exceeded 10,000
• NPS score improved to 72
• Launched 3 major product features

### Team Updates
• Engineering team grew from 15 to 22
• Opened London office
• New VP of Sales joined

### 2026 Vision
Focus on enterprise market, AI-powered insights, and international expansion.""",
            "overview": "Monthly all-hands with company updates and 2026 vision.",
            "participants": [
                {"name": "CEO - Mark Stevens", "email": "mark@company.com"},
                {"name": "Sarah Chen", "email": "sarah@company.com"},
                {"name": "Mike Johnson", "email": "mike@company.com"},
                {"name": "Lisa Morgan", "email": "lisa@company.com"},
            ],
            "topics": [
                {"title": "Q4 Results & Metrics", "start_time": 0, "end_time": 1200},
                {"title": "Product Launch Recap", "start_time": 1200, "end_time": 2400},
                {"title": "Team Growth & Culture", "start_time": 2400, "end_time": 3600},
                {"title": "2026 Vision & Q&A", "start_time": 3600, "end_time": 4500},
            ],
            "transcript": [
                ("CEO - Mark Stevens", 0, 40, "Welcome everyone to our January all-hands. What a quarter we've had!"),
                ("CEO - Mark Stevens", 40, 80, "Q4 revenue grew 45% quarter-over-quarter. We crossed 10,000 customers."),
                ("CEO - Mark Stevens", 80, 120, "Our NPS score improved to 72, up from 65 in Q3. Thank you all for the incredible work."),
                ("Sarah Chen", 120, 160, "On the product side, we shipped global search, the new dashboard, and real-time collaboration."),
                ("Mike Johnson", 160, 200, "Engineering grew from 15 to 22 this quarter. The London office is officially open."),
                ("Lisa Morgan", 200, 240, "Customer success handled 40% more onboarding calls while maintaining a 4.8 satisfaction score."),
                ("CEO - Mark Stevens", 240, 280, "Looking ahead to 2026, our focus is enterprise, AI insights, and international expansion."),
                ("CEO - Mark Stevens", 280, 320, "We need to follow up on the hiring plan for the enterprise sales team in EMEA."),
                ("Sarah Chen", 320, 350, "The AI team is working on ask-anything-about-your-meetings feature. Demo coming next month."),
                ("CEO - Mark Stevens", 350, 380, "Exciting stuff. Let's open it up for questions."),
            ],
            "action_items": [
                {"title": "Finalize EMEA enterprise sales hiring plan", "assignee": "CEO - Mark Stevens", "completed": False},
                {"title": "Prepare AI demo for next all-hands", "assignee": "Sarah Chen", "completed": False},
            ],
        },
        {
            "title": "Sales Pipeline Review - Q1",
            "date": datetime.utcnow() - timedelta(days=3),
            "duration_seconds": 2400,
            "summary": """## Sales Pipeline Summary

Weekly review of the Q1 sales pipeline with the revenue team.

### Pipeline Status
• Total pipeline value: $2.4M across 34 opportunities
• 8 deals in final negotiation stage
• Win rate improved to 32% from 28% last quarter

### Key Deals
• Acme Corp enterprise deal ($180K) — closing this week
• TechStart annual contract ($45K) — demo scheduled
• GlobalFin pilot ($90K) — security review in progress

### Blockers
Legal review delaying two enterprise contracts. Sales ops to follow up with legal team.""",
            "overview": "Weekly sales pipeline review covering Q1 opportunities and forecast.",
            "participants": [
                {"name": "Rachel Adams", "email": "rachel@company.com"},
                {"name": "Tom Baker", "email": "tom@company.com"},
                {"name": "Jennifer Walsh", "email": "jwalsh@client.com"},
            ],
            "topics": [
                {"title": "Pipeline Overview", "start_time": 0, "end_time": 600},
                {"title": "Key Deal Updates", "start_time": 600, "end_time": 1500},
                {"title": "Forecast & Blockers", "start_time": 1500, "end_time": 2400},
            ],
            "transcript": [
                ("Rachel Adams", 0, 25, "Good afternoon team. Let's review the Q1 pipeline. We're at $2.4 million across 34 active opportunities."),
                ("Tom Baker", 25, 55, "The Acme Corp deal is our biggest focus. Jennifer, can you give us an update on their timeline?"),
                ("Jennifer Walsh", 55, 90, "They're ready to sign this week pending final security review. Our champion is pushing internally."),
                ("Rachel Adams", 90, 120, "Great. TechStart is scheduled for a demo next Tuesday. Tom, you'll lead that?"),
                ("Tom Baker", 120, 150, "Yes, I'll prepare a custom demo focused on their integration requirements."),
                ("Rachel Adams", 150, 180, "Win rate is up to 32 percent which is encouraging. We need to follow up with legal on the GlobalFin contract."),
                ("Tom Baker", 180, 210, "I'll ping legal today. That deal has been stuck in review for two weeks."),
                ("Jennifer Walsh", 210, 240, "From the client side, faster turnaround on security questionnaires would help us close faster."),
            ],
            "action_items": [
                {"title": "Prepare TechStart custom demo", "assignee": "Tom Baker", "completed": False},
                {"title": "Follow up with legal on GlobalFin contract", "assignee": "Tom Baker", "completed": False},
                {"title": "Send updated pipeline report to leadership", "assignee": "Rachel Adams", "completed": True},
            ],
        },
        {
            "title": "UX Research Debrief - Onboarding Flow",
            "date": datetime.utcnow() - timedelta(days=7),
            "duration_seconds": 1800,
            "summary": """## UX Research Debrief

Debrief session on the latest onboarding usability study with 12 participants.

### Key Findings
• 67% of users couldn't find the meeting upload feature
• Average time-to-first-meeting: 8.5 minutes (target: 3 minutes)
• Mobile onboarding rated 3.2/5 vs web at 4.1/5

### Recommendations
• Add prominent upload CTA on home dashboard
• Simplify 3-step onboarding to 2 steps
• Create interactive product tour for first-time users

### Next Steps
Design team to iterate on mockups. Engineering to estimate implementation effort.""",
            "overview": "Usability study debrief on new user onboarding experience.",
            "participants": [
                {"name": "David Park", "email": "david@company.com"},
                {"name": "Emily Rodriguez", "email": "emily@company.com"},
                {"name": "Sarah Chen", "email": "sarah@company.com"},
            ],
            "topics": [
                {"title": "Study Methodology", "start_time": 0, "end_time": 400},
                {"title": "Key Findings", "start_time": 400, "end_time": 1000},
                {"title": "Recommendations", "start_time": 1000, "end_time": 1500},
                {"title": "Next Steps", "start_time": 1500, "end_time": 1800},
            ],
            "transcript": [
                ("David Park", 0, 30, "Thanks for joining. We tested onboarding with 12 participants last week. Let me share the findings."),
                ("David Park", 30, 70, "The biggest issue: 67 percent couldn't find the meeting upload feature without guidance."),
                ("Emily Rodriguez", 70, 100, "That matches our support data. Upload discovery is our top onboarding complaint."),
                ("Sarah Chen", 100, 130, "Average time to first meeting was 8 and a half minutes. Our target is 3 minutes."),
                ("David Park", 130, 165, "Mobile onboarding scored 3.2 out of 5 compared to 4.1 on web. We need to prioritize mobile fixes."),
                ("Emily Rodriguez", 165, 195, "Recommendation one: add a prominent upload button on the home dashboard."),
                ("David Park", 195, 225, "Recommendation two: reduce onboarding from three steps to two. Remove the calendar connect step."),
                ("Sarah Chen", 225, 255, "I'll need engineering estimates before we commit. David, can you have updated mockups by next Friday?"),
                ("David Park", 255, 280, "Absolutely. I'll also create an interactive product tour concept for first-time users."),
            ],
            "action_items": [
                {"title": "Deliver updated onboarding mockups by Friday", "assignee": "David Park", "completed": False},
                {"title": "Get engineering estimate for onboarding changes", "assignee": "Sarah Chen", "completed": False},
                {"title": "Design interactive product tour concept", "assignee": "David Park", "completed": False},
            ],
        },
    ]

    for i, data in enumerate(meetings_data):
        participants = [
            schemas.ParticipantCreate(
                name=p["name"],
                email=p["email"],
                avatar_color=AVATAR_COLORS[j % len(AVATAR_COLORS)],
            )
            for j, p in enumerate(data["participants"])
        ]
        transcript_segments = [
            schemas.TranscriptSegmentCreate(
                speaker_name=speaker,
                start_time=start,
                end_time=end,
                text=text,
            )
            for speaker, start, end, text in data["transcript"]
        ]
        action_items = [
            schemas.ActionItemCreate(
                title=a["title"],
                assignee=a["assignee"],
                completed=a["completed"],
            )
            for a in data["action_items"]
        ]
        topics = [schemas.TopicCreate(**t) for t in data["topics"]]

        meeting = schemas.MeetingCreate(
            title=data["title"],
            date=data["date"],
            duration_seconds=data["duration_seconds"],
            summary=data["summary"],
            overview=data["overview"],
            participants=participants,
            transcript_segments=transcript_segments,
            action_items=action_items,
            topics=topics,
        )
        crud.create_meeting(db, meeting)
