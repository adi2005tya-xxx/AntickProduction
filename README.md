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
