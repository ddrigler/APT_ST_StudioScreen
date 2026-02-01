const PLAYLIST_URL = "./playlist.json";

const stage = document.getElementById("stage");
const errorBox = document.getElementById("error");

let slides = [];
let intervalSeconds = 10;
let idx = -1;
let timer = null;

function showError(msg) {
  console.error(msg);
  errorBox.style.display = "flex";
  errorBox.textContent = msg;
}

async function loadPlaylist() {
  const res = await fetch(`${PLAYLIST_URL}?t=${Date.now()}`);
  if (!res.ok) throw new Error(`Could not load playlist.json (HTTP ${res.status})`);

  const data = await res.json();
  if (!Array.isArray(data.slides) || data.slides.length === 0) {
    throw new Error("playlist.json loaded, but slides is empty or not a list");
  }

  slides = data.slides;
  intervalSeconds = Number(data.intervalSeconds || 10);
}

function renderSlide(src) {
  stage.innerHTML = "";
  const img = document.createElement("img");
  img.src = src;

  img.onerror = () => showError(`Image failed to load: ${src}\nCheck filename and that it exists in /assets`);
  stage.appendChild(img);
}

function next() {
  idx = (idx + 1) % slides.length;
  renderSlide(slides[idx]);
}

async function start() {
  try {
    await loadPlaylist();
    next();

    if (timer) clearInterval(timer);
    timer = setInterval(next, intervalSeconds * 1000);

    // reload playlist every 10 minutes so updates roll out without touching TVs
    setInterval(async () => {
      try { await loadPlaylist(); }
      catch (e) { console.warn("Playlist refresh failed:", e); }
    }, 10 * 60 * 1000);

  } catch (e) {
    showError(`Screen failed to start.\n${e.message}\n\nTest:\n1) /playlist.json loads\n2) images exist in /assets with exact names`);
  }
}

start();
