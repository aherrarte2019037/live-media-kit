# Project Summary: Live Media Kit Platform

## 1. Product Vision

We are building a **"Live Media Kit"** Micro-SaaS for content creators.

- **Problem**: Creators currently pitch brands using static PDF media kits. These become outdated the moment they are sent (subscriber counts change, views go up).
- **Solution**: A dynamic, web-based media kit (e.g., `kit.bio/username`) that syncs with YouTube/Twitch/TikTok APIs to show real-time, verified metrics.

---

## 2. Core User Flows

### A. The Creator (Authenticated User)

1. **Onboarding**: Sign up via Google/Email (Supabase Auth).
2. **Connect Accounts**: OAuth flow to connect YouTube/Twitch channels.
3. **Theme Customization**: A "TweakCDN-style" editor. The user adjusts a color picker or border radius slider, and the preview updates instantly.
4. **Section Management**: Drag-and-drop interface to reorder sections (e.g., "About Me", "Audience Demographics", "Past Sponsors").
5. **Publishing**: User claims a handle (slug) and publishes their kit.

### B. The Brand (Public Visitor)

1. **Viewing**: Visits `app.domain.com/username`.
2. **Performance**: The page loads instantly. Data is fresh (cached <24h).
3. **Interaction**: Hover effects on charts, animated counters for subscriber numbers.
4. **Contact**: A protected "Work With Me" button (to prevent scraping) that reveals contact info or opens a form.

---

## 3. Key Business Logic & Constraints

### Quota Protection

We rely on the **YouTube Data API v3** which has a **10k daily limit**.

- **Rule**: The Public View (`apps/profile`) NEVER calls the YouTube API directly.
- **Mechanism**: We fetch data only via the Dashboard (manual refresh) or a background Cron job. We store this snapshot in Supabase. The Public View reads from Supabase.

### Theming Engine

The app does **not** use static themes. It uses **Runtime CSS Variables**.

- The Creator selects a primary color (e.g., `#FF0000`).
- We save this hex code to the database.
- On render, we inject `--primary: 0 100% 50%;` into the `<style>` tag of the body, allowing Tailwind v4 to pick it up dynamically.

---

## Key Technical Decisions

| Aspect | Implementation |
|--------|----------------|
| **API Strategy** | No direct API calls from public pages |
| **Data Freshness** | <24h cache via background jobs |
| **Theming** | Runtime CSS variables, no static themes |
| **Performance** | Instant page loads, optimistic UI updates |