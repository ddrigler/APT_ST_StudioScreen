const PLAYLIST_URL = "./playlist.json";

const stage = document.getElementById("stage");

let slides = [];
let idx = -1;
let intervalSeconds = 10;

async function loadPlaylist() {
  const res = await fetch(PLAYLIST_URL + "?t=" + Date.now());
  if (!res.ok) throw new Error("playlist.json not found");

  const data = await res.json();
  slides = data.slides || [];
  intervalSeconds = Number(data.intervalSeconds || 15);
}

function render(src) {
  stage.innerHTML = "";

  const img = document.createElement("img");
  img.src = src;

  img.onerror = () => {
    stage.innerHTML =
      '<div style="color:white;font:20px system-ui;padding:20px;">Image failed to load:<br>' +
      src +
      "</div>";
  };

  stage.appendChild(img);
}

function next() {
  if (!slides.length) return;

  idx = (idx + 1) % slides.length;
  render(slides[idx]);
}

async function start() {
  await loadPlaylist();
  next();
  setInterval(next, intervalSeconds * 1000);
}

start();
