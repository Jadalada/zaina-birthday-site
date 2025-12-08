const tracks = [
  {
    title: "Behind Blue Eyes",
    artist: "Limp Bizkit",
    src: "music/Behind Blue Eyes - Limp Bizkit.mp3",
    cover: "images/album_covers/Behind Blue Eyes - Limp Bizkit_cover.webp"
  },
  {
    title: "Black",
    artist: "Pearl Jam",
    src: "music/Black - Pearl Jam.mp3",
    cover: "images/album_covers/Black - Pearl Jam_cover.webp"
  },
  {
    title: "Cupid",
    artist: "Alexandra Savior",
    src: "music/Cupid - Alexandra Savior.mp3",
    cover: "images/album_covers/Cupid - Alexandra Savior_cover.webp"
  },
  {
    title: "Demolition Lovers",
    artist: "My Chemical Romance",
    src: "music/Demolition Lovers - My Chemical Romance.mp3",
    cover: "images/album_covers/Demolition Lovers - My Chemical Romance_cover.webp"
  },
  {
    title: "Eternally Yours",
    artist: "Motionless In White",
    src: "music/Eternally Yours - Motionless In White.mp3",
    cover: "images/album_covers/Eternally Yours - Motionless In White_cover.webp"
  },
  {
    title: "Gone With The Sin",
    artist: "HIM",
    src: "music/Gone With The Sin - HIM .mp3",
    cover: "images/album_covers/Gone With The Sin - HIM _cover.webp"
  },
  {
    title: "I Won't See You Tonight (Pt. 1)",
    artist: "Avenged Sevenfold",
    src: "music/I Won't See You Tonight Part 1 - Avenged Sevenfold.mp3",
    cover: "images/album_covers/I Won't See You Tonight Part 1 - Avenged Sevenfold_cover.webp"
  },
  {
    title: "Kiss Me Now",
    artist: "Pierce The Veil",
    src: "music/Kiss Me Now - Pierce The Veil.mp3",
    cover: "images/album_covers/Kiss Me Now - Pierce The Veil_cover.webp"
  },
  {
    title: "Kiss Me Until My Lips Fall Off",
    artist: "Lebanon Hanover",
    src: "music/Kiss Me Until My Lips Fall Off - Lebanon Hanover.mp3",
    cover: "images/album_covers/Kiss Me Until My Lips Fall Off - Lebanon Hanover_cover.webp"
  },
  {
    title: "Surreal",
    artist: "Flawed Mangoes",
    src: "music/Surreal - Flawed Mangoes.mp3",
    cover: "images/album_covers/Surreal - Flawed Mangoes_cover.webp"
  },
  {
    title: "Telephone",
    artist: "Lady Gaga",
    src: "music/Telephone - Lady Gaga.mp3",
    cover: "images/album_covers/Telephone - Lady Gaga_cover.webp"
  },
  {
    title: "Your Lips, My Mouth",
    artist: "Airiel",
    src: "music/Your Lips, My Mouth - Airiel.mp3",
    cover: "images/album_covers/Your Lips, My Mouth - Airiel_cover.webp"
  },
  {
    title: "Your Love",
    artist: "She Wants Revenge",
    src: "music/Your Love - She Wants Revenge.mp3",
    cover: "images/album_covers/Your Love - She Wants Revenge_cover.webp"
  }
];

const introMedia = [
  "images/zaina_media/1.webp",
  "images/zaina_media/2.webp",
  "images/zaina_media/3.webp",
  "images/zaina_media/7.webp",
  "images/zaina_media/8.webp",
  "images/zaina_media/11.webp",
  "images/zaina_media/12.webp",
  "images/zaina_media/13.webp",
  "images/zaina_media/14.webp",
  "images/zaina_media/15.webp",
  "images/zaina_media/17.webp",
  "images/zaina_media/20.webp",
  "images/zaina_media/21.webp",
  "images/zaina_media/22.webp",
  "images/zaina_media/23.webp",
  "images/zaina_media/24.webp"
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
const introOverlay = document.getElementById("intro-overlay");
const introImageEl = document.getElementById("intro-image");
const introTextEl = document.getElementById("intro-text");

const INTRO_FRAME_MS = 670;
const INTRO_SWAP_GAP_MS = 200;
const INTRO_TEXT_FADE_MS = 3000;
const INTRO_OVERLAY_FADE_MS = 2000;
const INTRO_MAX_BLUR = 15;
const CONFETTI_COLORS = [
  [237, 100, 166],
  [139, 92, 246],
  [168, 85, 247],
  [59, 130, 246],
  [255, 255, 255]
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getIntroText(progress) {
  if (progress < 1 / 3) return "I";
  if (progress < 2 / 3) return "I Love";
  return "I Love You";
}

function preloadImages(urls) {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = img.onerror = resolve;
          img.src = url;
        })
    )
  );
}

async function runIntroSequence() {
  if (!introOverlay || !introImageEl || !introTextEl || introMedia.length === 0) return;

  await preloadImages(introMedia);

  for (let i = 0; i < introMedia.length; i++) {
    const ratio = introMedia.length > 1 ? i / (introMedia.length - 1) : 1;
    const blurAmount = ratio * INTRO_MAX_BLUR * 0.5;
    introImageEl.removeAttribute("src");
    introImageEl.style.display = "none";
    introImageEl.style.filter = "blur(0px)";

    introImageEl.src = introMedia[i];
    try {
      if (typeof introImageEl.decode === "function") {
        await introImageEl.decode();
      }
    } catch (err) {
      // If decode fails, proceed to show the image anyway.
    }

    await wait(INTRO_SWAP_GAP_MS);
    introImageEl.style.filter = `blur(${blurAmount.toFixed(2)}px)`;
    introImageEl.style.display = "block";
    introTextEl.textContent = getIntroText(ratio);
    await wait(INTRO_FRAME_MS);
  }

  introImageEl.style.display = "none";
  introTextEl.textContent = "I Love You";

  introTextEl.classList.remove("is-fading");
  requestAnimationFrame(() => {
    introTextEl.classList.add("is-fading");
  });

  await wait(INTRO_TEXT_FADE_MS);

  introOverlay.classList.add("is-hidden");
  setTimeout(() => {
    if (introOverlay && introOverlay.parentElement) {
      introOverlay.remove();
    }
  }, INTRO_OVERLAY_FADE_MS + 60);
}

let confettiCanvas = null;
let confettiCtx = null;
let confettiParticles = [];
let confettiRAF = null;

function setupConfettiCanvas() {
  if (confettiCanvas) return;
  confettiCanvas = document.createElement("canvas");
  confettiCanvas.setAttribute("aria-hidden", "true");
  confettiCanvas.style.position = "fixed";
  confettiCanvas.style.inset = "0";
  confettiCanvas.style.pointerEvents = "none";
  confettiCanvas.style.zIndex = "50";
  document.body.appendChild(confettiCanvas);
  confettiCtx = confettiCanvas.getContext("2d");
  resizeConfettiCanvas();
  window.addEventListener("resize", resizeConfettiCanvas);
}

function resizeConfettiCanvas() {
  if (!confettiCanvas || !confettiCtx) return;
  confettiCanvas.style.width = "100vw";
  confettiCanvas.style.height = "100vh";
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCtx.setTransform(1, 0, 0, 1, 0, 0);
}

function addConfettiBurst(x, y, count = 14) {
  setupConfettiCanvas();
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 2);
    const speed = 4 + Math.random() * 4;
    const [r, g, b] = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    confettiParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      alpha: 1,
      decay: 0.97 + Math.random() * 0.02,
      color: `rgba(${r}, ${g}, ${b}, `
    });
  }
  if (!confettiRAF) {
    confettiRAF = requestAnimationFrame(drawConfetti);
  }
}

function drawConfetti() {
  if (!confettiCtx || !confettiCanvas) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles = confettiParticles.filter((p) => p.alpha > 0.05 && p.y < window.innerHeight + 40);
  for (const p of confettiParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.rotation += p.rotationSpeed;
    p.alpha *= p.decay;
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rotation);
    confettiCtx.fillStyle = `${p.color}${p.alpha})`;
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    confettiCtx.restore();
  }
  if (confettiParticles.length > 0) {
    confettiRAF = requestAnimationFrame(drawConfetti);
  } else {
    confettiRAF = null;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

document.addEventListener(
  "click",
  (event) => {
    const x = event.clientX || window.innerWidth / 2;
    const y = event.clientY || window.innerHeight / 2;
    addConfettiBurst(x, y, 12);
  },
  { passive: true }
);

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
  if (url) {
    artBox.style.backgroundImage = `url("${encodeURI(url)}")`;
  } else {
    artBox.style.backgroundImage = fallbackArt;
  }
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
runIntroSequence();
