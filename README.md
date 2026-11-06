# Quang Triệu · Content Organizer

A static project page for the Quang Triệu content organization assistant concept. The site presents its intended workflow, project components, current verification limits, a local prompt builder, and a fixed fictional demo.

## Pages

- `index.html` — overview, workflow, tools, test status, get started, and fixed demo.
- `workbench.html` — turns user-provided topic, requirements, and pasted text into an English instruction prompt that can be reviewed and copied.
- `style.css` — responsive editorial layout and visual system.
- `app.js` — local prompt generation, sample input, copy controls, and fixed fictional demo.
- `.nojekyll` — disables Jekyll processing on GitHub Pages.

## Scope

This is a standalone static demo. It does not connect to a live assistant or API, does not upload files, and does not process real media or news. Prompt instructions are generated in the browser from text the visitor pastes. The electric-bus scenario and summary are fictional format examples. A link to ChatGPT opens that separate website; it does not connect the demo to ChatGPT.

## Run locally

Open `index.html` in a browser, or run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Publish with GitHub Pages

Choose **Deploy from a branch**, select `main` and `/(root)` in **Settings → Pages**, then save.