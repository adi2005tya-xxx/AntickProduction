# Digital Wedding Invitations

Immersive, web-based wedding invitations (intro → details → RSVP → post-event).
Plain static HTML/CSS/JS, so there is no build step.

| Path | What it is |
|------|-----------|
| `/` | Redirects to the photo-based Wada invitation |
| `/generic` | Generic wedding invitation prototype with live customizer |
| `/maharashtrian/wada` | Ancient wada: carved doors, scroll, toran, diyas |
| `/maharashtrian/paithani` | Paithani silk: zari cloth that splits open |
| `/maharashtrian/antarpat` | Antarpat: modern, colourful, petals and rice |

Shared content (names, date, venue, Marathi/English text) lives in `maharashtrian/common.js`.
Personalise an invite with `?guest=Name` on the URL.

## Run locally
Open any `.html` file, or serve the folder: `npx serve .`

## Deploy
Import the repo in Vercel → Framework preset **Other** → no build command, output directory `.`

## Wada invitation (`/wada`)
- Intro: drone view -> descend -> tap the real wada door -> the two leaves swing open -> walk into the courtyard.
- **Your own drone footage:** save a short MP4 as `assets/wada/drone.mp4` and it plays as the opening shot automatically (the still aerial photo is the fallback).
- **Couple photos:** add `assets/wada/groom.jpg` and `assets/wada/bride.jpg`.
- All stock photos are from Wikimedia Commons; credits are listed in the page footer (`assets/wada/credits.js`).
