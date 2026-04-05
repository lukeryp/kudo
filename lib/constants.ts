import type { Stage, StageId, Template } from '@/types'

export const STAGES: Stage[] = [
  { id: 'post-lesson', label: 'Post-Lesson', color: '#6496ff' },
  { id: 'hook-sent', label: 'Hook Sent', color: '#00af51' },
  { id: '2-week', label: '2-Week Check-In', color: '#00d462' },
  { id: '4-week', label: '4-Week Ask', color: '#f4ee19' },
  { id: '8-week', label: '8-Week Follow-Up', color: '#ff9500' },
  { id: 'video-received', label: 'Video Received', color: '#b464ff' },
  { id: 'approved', label: 'Approved', color: '#00af51' },
  { id: 'deployed', label: 'Deployed', color: '#f4ee19' },
]

export const STAGE_MAP: Record<StageId, Stage> = Object.fromEntries(
  STAGES.map((s) => [s.id, s]),
) as Record<StageId, Stage>

export const STAGE_TEMPLATE_MAP: Partial<Record<StageId, string>> = {
  'post-lesson': 'post-hook',
  'hook-sent': '2wk',
  '2-week': '4wk',
  '4-week': '8wk',
  '8-week': '8wk-deep',
}

export const ACTIVE_STAGES: StageId[] = [
  'post-lesson',
  'hook-sent',
  '2-week',
  '4-week',
  '8-week',
]

export const TERMINAL_STAGES: StageId[] = ['video-received', 'approved', 'deployed']

export const TESTIMONIAL_STAGES: StageId[] = ['video-received', 'approved', 'deployed']

export const TEMPLATES: Template[] = [
  {
    id: 'welcome',
    title: 'Welcome to The Workshop',
    stage: 'Pre-Lesson',
    subject: "Your lesson is booked — here's what to expect",
    body: `Hey [Student Name],

I'm looking forward to working with you — truly. I take every lesson seriously because I know you do too.

Before we meet, I want to give you a heads-up on how I work:

This isn't a quick tip session. We're going to take a real look at your game, find the one thing that's costing you the most, and build a clear path forward. Most of my students see measurable changes within 2–4 weeks of focused practice.

What to bring:
— Your current clubs (even if you're embarrassed by them)
— Any notes on what's been frustrating you
— An open mind

I'll be following up after our session with some specific resources based on what we uncover. Pay attention to that email — it's part of the process.

See you soon,
[Coach Name]`,
  },
  {
    id: 'post-hook',
    title: 'Post-Lesson Hook',
    stage: 'Day 1',
    subject: "What we found — and what's next",
    body: `Hey [Student Name],

Yesterday was a great session. We covered a lot of ground, and I want to make sure you leave with more than just a feeling of "that was helpful."

Here's what stood out to me:

The core issue we identified is something that most golfers never address — and it's costing you more strokes than you realize. The good news: it's fixable, and you already showed the pattern for it in your swing.

Over the next 4 weeks, I want to watch what happens when you apply what we worked on.

No ask here. No homework assignment you'll ignore. Just this: keep playing, notice what changes, and I'll check back in two weeks with something to help you track it.

Talk soon,
[Coach Name]`,
  },
  {
    id: '2wk',
    title: '2-Week Check-In',
    stage: '2 Weeks',
    subject: 'Your progress folder is ready',
    body: `Hey [Student Name],

Two weeks. Let's take stock.

I've put together a short progress folder for you — it includes a recap of what we worked on, the drill sequence I recommended, and a few benchmarks to check your progress against.

[LINK TO PROGRESS FOLDER]

This is yours to keep, no strings attached. I put these together because I've found that students who can see their own progress on paper are twice as likely to actually stick with the work.

How's it been going? Any wins? Any moments where you felt the difference in your swing?

Reply and let me know — I genuinely want to hear.

[Coach Name]`,
  },
  {
    id: '4wk',
    title: '4-Week Ask',
    stage: '4 Weeks',
    subject: 'A quick ask — and something for you',
    body: `Hey [Student Name],

It's been about a month since your lesson, and I've been thinking about you.

I have a simple ask: if our session made a real difference for you, would you be willing to share that? Not a written review — something real. A 60-second video on your phone. Just you, talking about what shifted for you and what it's meant for your game.

These stories are what allow me to keep teaching the way I do. They're what convince other golfers that this work is worth it.

If you're in, just reply to this email and I'll send you a simple one-question prompt to answer. Takes less than 2 minutes.

And as a thank you — I want to offer you 33% off your next session whenever you're ready to go deeper. No expiration date.

Either way, I appreciate you. Hope the game has been good.

[Coach Name]`,
  },
  {
    id: '8wk',
    title: '8-Week Follow-Up',
    stage: '8 Weeks',
    subject: 'Still thinking about your swing',
    body: `Hey [Student Name],

I know, I know — life gets busy. Golf especially.

I sent you a note a few weeks ago asking if you'd be willing to share your experience working with me. No pressure if the timing wasn't right.

But I wanted to follow up one more time, because the students who share their stories are the ones who tend to keep improving. There's something about putting your growth into words that makes it stick.

If you've seen any change in your game — even subtle — that's worth capturing. 60 seconds on your phone. That's all.

And the 33% discount offer still stands.

[Coach Name]`,
  },
  {
    id: '8wk-deep',
    title: '8-Week Deeper Story',
    stage: '8 Weeks (Alt)',
    subject: 'Want to go deeper on your story?',
    body: `Hey [Student Name],

You were kind enough to share your experience with me a few weeks ago — and it meant a lot.

I wanted to reach back out because I'm putting together a short feature on the kind of transformation you went through. Not a sales piece — more like a case study for other golfers who are stuck where you were.

Would you be open to a 10-minute call or a few follow-up questions over email? I'd love to capture your story with a bit more depth — what you were struggling with, what the breakthrough was, and where your game is now.

If yes, just reply and we'll set it up.

Thank you again,
[Coach Name]`,
  },
]
