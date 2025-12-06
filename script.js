const tracks = [
  { title: "Behind Blue Eyes", artist: "Limp Bizkit", src: "music/Behind Blue Eyes - Limp Bizkit.mp3" },
  { title: "Black", artist: "Pearl Jam", src: "music/Black - Pearl Jam.mp3" },
  { title: "Cupid", artist: "Alexandra Savior", src: "music/Cupid - Alexandra Savior.mp3" },
  { title: "Demolition Lovers", artist: "My Chemical Romance", src: "music/Demolition Lovers - My Chemical Romance.mp3" },
  { title: "Eternally Yours", artist: "Motionless In White", src: "music/Eternally Yours - Motionless In White.mp3" },
  { title: "Gone With The Sin", artist: "HIM", src: "music/Gone With The Sin - HIM .mp3" },
  { title: "I Won't See You Tonight (Pt. 1)", artist: "Avenged Sevenfold", src: "music/I Won't See You Tonight Part 1 - Avenged Sevenfold.mp3" },
  { title: "Kiss Me Now", artist: "Pierce The Veil", src: "music/Kiss Me Now - Pierce The Veil.mp3" },
  { title: "Kiss Me Until My Lips Fall Off", artist: "Lebanon Hanover", src: "music/Kiss Me Until My Lips Fall Off - Lebanon Hanover.mp3" },
  { title: "Saturday Saviour", artist: "Failure", src: "music/Saturday Saviour - Failure.mp3" },
  { title: "Surreal", artist: "Flawed Mangoes", src: "music/Surreal - Flawed Mangoes.mp3" },
  { title: "Telephone", artist: "Lady Gaga", src: "music/Telephone - Lady Gaga.mp3" },
  { title: "Your Lips, My Mouth", artist: "Airiel", src: "music/Your Lips, My Mouth - Airiel.mp3" },
  { title: "Your Love", artist: "She Wants Revenge", src: "music/Your Love - She Wants Revenge.mp3" }
];

const audio = new Audio();
audio.preload = "metadata";

let currentIndex = 0;

const titleEl = document.getElementById("track-title");
const artistEl = document.getElementById("track-artist");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const trackListEl = document.getElementById("track-list");
const progressContainer = document.querySelector(".progress");
const artBox = document.getElementById("art-box");
const artCache = new Map();
const audioBufferCache = new Map();
const audioUrlCache = new Map();
const fallbackArt =
  "radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.14), transparent 55%), radial-gradient(circle at 70% 70%, rgba(59, 7, 100, 0.24), transparent 60%), rgba(255, 255, 255, 0.02)";

function formatTime(seconds) {
  if (Number.isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function highlightActive() {
  document.querySelectorAll(".track").forEach((el, idx) => {
    el.classList.toggle("active", idx === currentIndex);
  });
}

function setAlbumArt(url) {
  if (!artBox) return;
  artBox.style.backgroundImage = url ? `url(${url})` : fallbackArt;
}

function loadTrack(index) {
  currentIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentIndex];
  const preloadedUrl = audioUrlCache.get(track.src);
  audio.src = preloadedUrl || encodeURI(track.src);
  titleEl.textContent = track.title;
  artistEl.textContent = track.artist;
  progressBar.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  highlightActive();
  if (artCache.has(track.src)) {
    setAlbumArt(artCache.get(track.src));
  } else {
    setAlbumArt(null);
    getAlbumArt(track.src)
      .then((url) => {
        if (currentIndex === tracks.indexOf(track)) {
          setAlbumArt(url);
        }
      })
      .catch(() => setAlbumArt(null));
  }
}

function playTrack() {
  audio
    .play()
    .then(() => {
      playBtn.textContent = "⏸";
    })
    .catch(() => {
      playBtn.textContent = "▶";
    });
}

function pauseTrack() {
  audio.pause();
  playBtn.textContent = "▶";
}

function togglePlay() {
  if (audio.paused) {
    playTrack();
  } else {
    pauseTrack();
  }
}

function nextTrack() {
  loadTrack(currentIndex + 1);
  playTrack();
}

function prevTrack() {
  loadTrack(currentIndex - 1);
  playTrack();
}

function buildTrackList() {
  tracks.forEach((track, idx) => {
    const el = document.createElement("div");
    el.className = "track";
    el.innerHTML = `
      <div class="track__meta">
        <div class="track__index">${idx + 1}</div>
        <div>
          <p class="track__title">${track.title}</p>
          <p class="track__artist">${track.artist}</p>
        </div>
      </div>
      <span class="muted">Play</span>
    `;

    el.addEventListener("click", () => {
      loadTrack(idx);
      playTrack();
    });

    trackListEl.appendChild(el);
  });
}

playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevTrack);
nextBtn.addEventListener("click", nextTrack);

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${progress || 0}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", nextTrack);

progressContainer.addEventListener("click", (event) => {
  const rect = progressContainer.getBoundingClientRect();
  const ratio = (event.clientX - rect.left) / rect.width;
  if (!Number.isNaN(audio.duration)) {
    audio.currentTime = audio.duration * Math.min(Math.max(ratio, 0), 1);
  }
});

document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

function parseSynchsafe(int) {
  return (
    ((int & 0x7f000000) >> 3) +
    ((int & 0x007f0000) >> 2) +
    ((int & 0x00007f00) >> 1) +
    (int & 0x0000007f)
  );
}

function extractAlbumArt(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  if (view.getUint8(0) !== 0x49 || view.getUint8(1) !== 0x44 || view.getUint8(2) !== 0x33) {
    return null;
  }

  const version = view.getUint8(3);
  const flags = view.getUint8(5);
  const tagSize = parseSynchsafe(view.getUint32(6, false));
  let offset = 10;
  let end = 10 + tagSize;

  if (flags & 0x40) {
    if (version === 4) {
      const extSize = parseSynchsafe(view.getUint32(offset, false));
      offset += extSize + 4;
    } else if (version === 3) {
      const extSize = view.getUint32(offset, false);
      offset += extSize + 4;
    }
  }

  end = Math.min(end, arrayBuffer.byteLength);
  const textDecoder = new TextDecoder();

  if (version === 2) {
    while (offset + 6 <= end) {
      const id = String.fromCharCode(view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2));
      const size = (view.getUint8(offset + 3) << 16) | (view.getUint8(offset + 4) << 8) | view.getUint8(offset + 5);
      if (!id.trim() || size <= 0) break;
      const frameStart = offset + 6;
      const frameEnd = Math.min(frameStart + size, arrayBuffer.byteLength);
      if (id === "PIC") {
        let cursor = frameStart + 1;
        const format = String.fromCharCode(view.getUint8(cursor), view.getUint8(cursor + 1), view.getUint8(cursor + 2));
        cursor += 3;
        cursor += 1;
        while (cursor < frameEnd && view.getUint8(cursor) !== 0) cursor++;
        cursor += 1;
        const mime = format === "PNG" ? "image/png" : "image/jpeg";
        const imageData = arrayBuffer.slice(cursor, frameEnd);
        return URL.createObjectURL(new Blob([imageData], { type: mime }));
      }
      offset = frameEnd;
    }
  } else if (version === 3 || version === 4) {
    while (offset + 10 <= end) {
      const id = String.fromCharCode(
        view.getUint8(offset),
        view.getUint8(offset + 1),
        view.getUint8(offset + 2),
        view.getUint8(offset + 3)
      );
      const size = version === 4 ? parseSynchsafe(view.getUint32(offset + 4, false)) : view.getUint32(offset + 4, false);
      if (!id.trim() || size <= 0) break;
      const frameStart = offset + 10;
      const frameEnd = Math.min(frameStart + size, arrayBuffer.byteLength);
      if (id === "APIC") {
        let cursor = frameStart + 1;
        const mimeBytes = [];
        while (cursor < frameEnd && view.getUint8(cursor) !== 0) {
          mimeBytes.push(view.getUint8(cursor));
          cursor++;
        }
        const mime = mimeBytes.length ? textDecoder.decode(new Uint8Array(mimeBytes)) : "image/jpeg";
        cursor += 1;
        cursor += 1;
        while (cursor < frameEnd && view.getUint8(cursor) !== 0) cursor++;
        cursor += 1;
        const imageData = arrayBuffer.slice(cursor, frameEnd);
        return URL.createObjectURL(new Blob([imageData], { type: mime || "image/jpeg" }));
      }
      offset = frameEnd;
    }
  }
  return null;
}

async function getAlbumArt(src) {
  if (artCache.has(src)) return artCache.get(src);

  const existingBuffer = audioBufferCache.get(src);
  if (existingBuffer) {
    const cachedArt = extractAlbumArt(existingBuffer);
    artCache.set(src, cachedArt);
    return cachedArt;
  }

  try {
    const res = await fetch(src);
    const buffer = await res.arrayBuffer();
    audioBufferCache.set(src, buffer);
    const artUrl = extractAlbumArt(buffer);
    artCache.set(src, artUrl);
    return artUrl;
  } catch {
    artCache.set(src, null);
    return null;
  }
}

async function preloadAssets() {
  const tasks = tracks.map(async (track) => {
    if (audioUrlCache.has(track.src) && artCache.has(track.src)) return;
    try {
      const res = await fetch(track.src);
      const buffer = await res.arrayBuffer();
      audioBufferCache.set(track.src, buffer);
      const mime = res.headers.get("content-type") || "audio/mpeg";
      const blobUrl = URL.createObjectURL(new Blob([buffer], { type: mime }));
      audioUrlCache.set(track.src, blobUrl);
      if (!artCache.has(track.src)) {
        artCache.set(track.src, extractAlbumArt(buffer));
      }
      if (track.src === tracks[currentIndex].src && artCache.get(track.src)) {
        setAlbumArt(artCache.get(track.src));
      }
    } catch (err) {
      audioBufferCache.set(track.src, null);
      if (!artCache.has(track.src)) artCache.set(track.src, null);
      console.warn("Preload failed for", track.src, err);
    }
  });
  return Promise.allSettled(tasks);
}

buildTrackList();
loadTrack(0);
pauseTrack();
preloadAssets();
