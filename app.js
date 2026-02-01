const PLAYLIST_URL = "./playlist.json";

const stage = document.getElementById("stage");
let slides = [];
let idx = -1;
let defaultDuration = 10;

async function loadPlaylist() {
  const res = await fetch(`${PLAYLIST_URL}?t=${Date.now()}`);
  if (!res.ok) throw new Error(`Playlist fetch failed: ${res.status}`);
  const data = await res.json();
  slides = data.slides || [];
  defaultDuration = data.defaultDuration || 10;
}

function render(slide) {
  stage.innerHTML = "";
  const duration = Number(slide.duration || defaultDuration);

  const img = document.createElement("img");
  img.src = slide.src;
  stage.appendChild(img);

  setTimeout(next, duration * 1000);
}

function next() {
  if (!slides.length) {
    stage.innerHTML = '<div style="color:#fff;font:20px system-ui">No slides</div>';
    return;
  }
  idx = (idx + 1) % slides.length;
  render(slides[idx]);
}

(async function start() {
  try {
    await loadPlaylist();
    next();
    setInterval(loadPlaylist, 10 * 60 * 1000); // refresh every 10 min
  } catch (e) {
    console.error(e);
    stage.innerHTML = '<div style="color:#fff;font:20px system-ui">Error loading playlist</div>';
  }
})();
