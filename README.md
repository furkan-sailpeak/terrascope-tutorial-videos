<p align="center">
  <img src="assets/logo.png" alt="Terrascope" height="64" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="assets/kuleuven-logo.svg" alt="KU Leuven" height="64" />
</p>

<h1 align="center">Terrascope Tutorial Videos</h1>

<p align="center">
  KU Leuven, Faculty of Science, <i>Science Communication and Outreach</i> course<br/>
  Jorge Martínez Vázquez · Furkan Demir · Ayan Keykavoosi · Ahmed Taleb Ahmed Al-Qathmi<br/>
  April 26, 2026
</p>

---

A small static site that hosts the Terrascope tutorial video series. The first video,
*Welcome to Terrascope*, is bundled with English, French, and Dutch captions.
The communication plan that drives the series is published at `/plan.html`.

## Stack

- **HTML + CSS + vanilla JS**, no build step.
- **`<video>` + `<track>`** for on-demand caption switching (EN / FR / NL / Off).
- **WebVTT** subtitle files in `subtitles/`.
- Served by **nginx (alpine)** in production via Docker.
- Deployable to **Railway** with the included `railway.json`.

## Layout

```
website/
├── index.html         hero, video player, chapters, tutorial grid
├── plan.html          communication plan
├── style.css          Terrascope-branded responsive styling
├── script.js          caption language switcher + chapter quick-jumps
├── videos/            mp4 video assets
├── subtitles/         Video1.{en,fr,nl}.vtt
├── assets/            logos and images
├── Dockerfile         nginx static-site image
├── nginx.conf         routing, MIME types (incl. text/vtt), caching
├── railway.json       Railway build & deploy config
└── README.md
```

## Run locally (zero dependencies)

```bash
python3 -m http.server 8000
# open http://127.0.0.1:8000
```

## Run with Docker

```bash
docker build -t terrascope-tutorials .
docker run -p 8080:8080 terrascope-tutorials
# open http://127.0.0.1:8080
```

## Deploy to Railway

1. Push this repo to GitHub.
2. In Railway, **New Project → Deploy from GitHub repo** and pick this repository.
3. Railway reads `railway.json` and builds the Dockerfile. No env vars are required.
4. Add a public domain under the service's **Settings → Networking** to expose it.

The container listens on `$PORT` (Railway sets this automatically).
A healthcheck endpoint is available at `/healthz`.

## Updating captions

Edit the source segments in `../output/subtitles/build_subs.py` (timestamps are
already aligned to the rendered video timeline) and run:

```bash
python3 ../output/subtitles/build_subs.py
cp ../output/subtitles/Video1.*.vtt subtitles/
```

## Adding the next video

1. Render the new video (e.g. via `../output/video2.sh`, which reuses
   `../output/template/`).
2. Drop the resulting mp4 into `videos/` and the new VTT files into `subtitles/`.
3. Add a new `<section>` (or activate the placeholder card) in `index.html`.
