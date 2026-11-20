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

## Wada invitation (`/wada`) - a real 3D wada
- Built with three.js (loaded from the jsDelivr CDN): the lane, front facade, hinged teak door, courtyard (chowk), turned pillars, cusped arches, balconies, tiled roofs, marigold torans, brass lanterns, tulsi vrindavan, rangoli, diyas and a swing - all modelled in `assets/wada3d/scene.js`.
- The camera flies in over the rooftops (drone view), lands in the lane, you tap the door, the two leaves swing open and the camera walks into the courtyard. A **Drone view** button lets guests lift back up and orbit the wada.
- The door leaves use the real wada door photo; surfaces use CC0 textures from Poly Haven (stone, brick, plaster, roof tiles, wood) in `assets/wada3d/`.
- If WebGL is unavailable the page falls back to a photo hero.
- **Couple photos:** add `assets/wada/groom.jpg` and `assets/wada/bride.jpg`.
- Photo credits (Wikimedia Commons) are listed in the page footer (`assets/wada/credits.js`).
