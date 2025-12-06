const tracks = [
  {
    title: "Behind Blue Eyes",
    artist: "Limp Bizkit",
    src: "music/Behind Blue Eyes - Limp Bizkit.mp3",
    cover: "images/Behind Blue Eyes - Limp Bizkit_cover.webp"
  },
  {
    title: "Black",
    artist: "Pearl Jam",
    src: "music/Black - Pearl Jam.mp3",
    cover: "images/Black - Pearl Jam_cover.webp"
  },
  {
    title: "Cupid",
    artist: "Alexandra Savior",
    src: "music/Cupid - Alexandra Savior.mp3",
    cover: "images/Cupid - Alexandra Savior_cover.webp"
  },
  {
    title: "Demolition Lovers",
    artist: "My Chemical Romance",
    src: "music/Demolition Lovers - My Chemical Romance.mp3",
    cover: "images/Demolition Lovers - My Chemical Romance_cover.webp"
  },
  {
    title: "Eternally Yours",
    artist: "Motionless In White",
    src: "music/Eternally Yours - Motionless In White.mp3",
    cover: "images/Eternally Yours - Motionless In White_cover.webp"
  },
  {
    title: "Gone With The Sin",
    artist: "HIM",
    src: "music/Gone With The Sin - HIM .mp3",
    cover: "images/Gone With The Sin - HIM _cover.webp"
  },
  {
    title: "I Won't See You Tonight (Pt. 1)",
    artist: "Avenged Sevenfold",
    src: "music/I Won't See You Tonight Part 1 - Avenged Sevenfold.mp3",
    cover: "images/I Won't See You Tonight Part 1 - Avenged Sevenfold_cover.webp"
  },
  {
    title: "Kiss Me Now",
    artist: "Pierce The Veil",
    src: "music/Kiss Me Now - Pierce The Veil.mp3",
    cover: "images/Kiss Me Now - Pierce The Veil_cover.webp"
  },
  {
    title: "Kiss Me Until My Lips Fall Off",
    artist: "Lebanon Hanover",
    src: "music/Kiss Me Until My Lips Fall Off - Lebanon Hanover.mp3",
    cover: "images/Kiss Me Until My Lips Fall Off - Lebanon Hanover_cover.webp"
  },
  {
    title: "Saturday Saviour",
    artist: "Failure",
    src: "music/Saturday Saviour - Failure.mp3",
    cover: "images/Saturday Saviour - Failure_cover.webp"
  },
  {
    title: "Surreal",
    artist: "Flawed Mangoes",
    src: "music/Surreal - Flawed Mangoes.mp3",
    cover: "images/Surreal - Flawed Mangoes_cover.webp"
  },
  {
    title: "Telephone",
    artist: "Lady Gaga",
    src: "music/Telephone - Lady Gaga.mp3",
    cover: "images/Telephone - Lady Gaga_cover.webp"
  },
  {
    title: "Your Lips, My Mouth",
    artist: "Airiel",
    src: "music/Your Lips, My Mouth - Airiel.mp3",
    cover: "images/Your Lips, My Mouth - Airiel_cover.webp"
  },
  {
    title: "Your Love",
    artist: "She Wants Revenge",
    src: "music/Your Love - She Wants Revenge.mp3",
    cover: "images/Your Love - She Wants Revenge_cover.webp"
  }
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
  audio.src = encodeURI(track.src);
  titleEl.textContent = track.title;
  artistEl.textContent = track.artist;
  progressBar.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  highlightActive();
  setAlbumArt(track.cover || null);
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

function preloadCovers() {
  tracks.forEach((track) => {
    if (!track.cover) return;
    const img = new Image();
    img.src = track.cover;
  });
}

buildTrackList();
loadTrack(0);
pauseTrack();
preloadCovers();
