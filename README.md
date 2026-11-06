# Kaytlin

Kaytlin is a quiet, garden inspired planner for tending to everyday life. Its editorial landing page introduces the project in six clear sections, followed by a personal workbench with Today, Tasks, Goals, Daily Check-in, and Notes.

## What you can do

- Add, complete, filter, and remove tasks.
- Plant goals, add small steps, and track progress as steps are completed.
- Choose a mood and save a short daily reflection.
- Write notes that save automatically.
- Use the responsive layout on desktop and mobile.

Planner content is stored in local storage in the current browser. It does not sync between devices and does not connect to an AI assistant or notification service.

## Files

- `index.html` — landing page
- `workbench.html` — personal planner
- `style.css` — responsive garden paper styling
- `app.js` — navigation, planner interactions, and local storage
- `.nojekyll` — tells GitHub Pages not to run Jekyll processing

## Run locally

Open `index.html` in a browser. For a local web server, run `python -m http.server 8000` in this folder, then visit `http://localhost:8000`.

## Publish with GitHub Pages

Create a public repository named `kaytlin`, add the six website files to the root of the `main` branch, then in **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, and save. GitHub Pages may take a few minutes to publish the first build.