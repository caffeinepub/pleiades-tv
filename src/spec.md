# Specification

## Summary
**Goal:** Build the “Pleiades TV” VOD app with Internet Identity authentication, a seeded video catalog, subscription-gated playback, and engagement features (comments, likes, sharing) in a consistent visual theme.

**Planned changes:**
- Create the Pleiades TV app shell with a distinctive, consistent theme and English UI text.
- Add Internet Identity sign-in/out and expose the authenticated principal for gated actions.
- Implement a backend video catalog (list + detail) with seeded sample videos (id, title, description, thumbnail URL, playback URL, duration, created timestamp).
- Build browsing and playback UI: home grid/list and a video detail page with loading/error states.
- Implement global subscriptions (subscribe/unsubscribe + status) and enforce playback access for subscribed users only.
- Implement video comments (add + list with author identifier and timestamp) with live UI updates after posting.
- Implement per-user video likes (like/unlike, like count, persisted state).
- Add sharing on video detail (Web Share API when available, otherwise copy-to-clipboard) with user feedback.
- Add an account/subscription page showing principal (or short form) and subscription management.
- Add generated static branding/placeholder images under `frontend/public/assets/generated` and render them in the UI (logo + placeholders).

**User-visible outcome:** Users can browse a seeded catalog, sign in with Internet Identity, subscribe to unlock playback, like and comment on videos, share video links, and manage their account/subscription status.
