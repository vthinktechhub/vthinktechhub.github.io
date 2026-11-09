/*
  VThink Tech Hub events.
  To add an event, copy one block below and edit it. The page sorts events by date and splits them into Upcoming and Past.

  Fields
    id        short unique slug, used in the page link (events.html#id)
    title     event name
    date      "YYYY-MM-DD", "YYYY-MM" or "YYYY". Leave "" when there is no fixed date (shown as "Open now").
    status    optional: "upcoming" or "past", to override what the date says
    time      e.g. "10:00 AM – 1:00 PM" (optional)
    venue     where it happens (optional)
    type      Workshop, Pitch panel, Expert talk, Open call, ... (optional)
    summary   one or two sentences shown in the popup
    poster    banner/poster image path (optional; a VThink poster is drawn when empty)
    photos    list of photo paths (optional). The popup slides through the poster and then these photos.
    links     list of buttons: { label: "Register", url: "https://..." } (optional; the first one is gold)

  The entries below use only what is already on the VThink Tech Hub site. Add real workshops, pitch panels and talks as they are scheduled.
*/
window.VTHINK_EVENTS = [
  {
    id: "startup-idea-call",
    title: "Share Your Startup Idea",
    date: "",
    status: "upcoming",
    venue: "Online form",
    type: "Open call",
    summary: "Any Vikas College student can share a startup idea with VThink Tech Hub. We help student founders validate real problems, build products and reach their first users.",
    poster: "assets/forms/idea-banner.png",
    links: [
      { label: "Share your startup idea", url: "https://docs.google.com/forms/d/e/1FAIpQLSem9OOOPc6LOnnLt4neyLNudS6oBp3Tt-3rENYxAugEQbA9gA/viewform" }
    ]
  },
  {
    id: "mentor-call",
    title: "Become a Mentor",
    date: "",
    status: "upcoming",
    venue: "Online form",
    type: "Open call",
    summary: "Mentor a VThink startup as a startup mentor, in office hours, on a pitch panel or with an expert talk. Fill in the mentor form and the hub will match you with a team in your field.",
    poster: "assets/forms/mentor-banner.png",
    links: [
      { label: "Mentor sign-up form", url: "https://docs.google.com/forms/d/e/1FAIpQLSfCMGrQJ0uQo44EmUvgue6kF-CiHzWi4oVG7m3ylhtKGYUgGw/viewform" },
      { label: "Email the hub", url: "mailto:ssujith@vikasinstitutionsnunna.org?subject=Mentoring%20at%20VThink%20Tech%20Hub" }
    ]
  },
  {
    id: "cohort-1",
    title: "Cohort 1 · 2026",
    date: "2026",
    status: "past",
    venue: "Vikas College of Engineering and Technology, Nunna",
    type: "Cohort launch",
    summary: "The first student ventures incubated at VThink Tech Hub: HOPE FUND, DAWA FIND, LUMIQ, EcopenX and Smart Hundi, with 18 student founders and leads across 5 domains.",
    poster: "",
    photos: [
      "assets/img/hope-fund.png",
      "assets/img/dawa-find.jpg",
      "assets/img/ecopenx.jpg",
      "assets/img/smart-hundi.jpg"
    ],
    links: [
      { label: "Meet our startups", url: "index.html#cohort" },
      { label: "View hub presentation", url: "https://1drv.ms/p/c/8B4E266C5504FF8E/IQCck2ysnX0TSLg2LRsooKwKAYEWzN-IRuu8F5PGw6auK8M?e=hHgWfl" }
    ]
  }
];
