const songs = [
  { src: "Minecraft.mp3", title: "Minecraft", artist: "c418", img: "브금.png" },
  { src: "wet Hands.mp3", title: "wet Hands", artist: "c418", img: "브금.png" },
  { src: "Haggstrom.mp3", title: "Haggstrom", artist: "c418", img: "브금.png" }
];

let currentIndex = 0;
const audio = new Audio();
let playBtn, titleInput, artistInput, slider, player;

function initPlayer() {
  playBtn = document.getElementById('playBtn');
  titleInput = document.getElementById('track');
  artistInput = document.getElementById('artist');
  slider = document.getElementById('slider');
  player = document.querySelector('.cd-player');

  const saved = JSON.parse(localStorage.getItem('cd-state'));
  if (saved) {
    currentIndex = saved.index || 0;
    audio.currentTime = saved.time || 0;
    if (saved.x) player.style.left = saved.x;
    if (saved.y) player.style.top = saved.y;
    if (saved.closed) closePlayer();
    else if (saved.minimized) minimizePlayer();
  }

  loadSong(currentIndex);
  if (saved && saved.playing) audio.play();
}

audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  slider.value = percent || 0;
});

audio.addEventListener('ended', nextSong);

slider.addEventListener('input', () => {
  const percent = slider.value / 100;
  audio.currentTime = percent * audio.duration;
});

function loadSong(index) {
  audio.src = songs[index].src;
  titleInput.value = songs[index].title;
  artistInput.value = songs[index].artist;
  saveState();
}

function playPause() {
  if (audio.paused) {
    audio.play();
    updatePlayButtonState(true);
  } else {
    audio.pause();
    updatePlayButtonState(false);
  }
  saveState();
}

function togglePlayButton() {
  playPause();
}

function updatePlayButtonState(isPlaying) {
  if (isPlaying) playBtn.classList.add('active');
  else playBtn.classList.remove('active');
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playPause();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playPause();
}

function rewind() {
  audio.currentTime = 0;
  saveState();
}

function forward() {
  audio.currentTime += 10;
  saveState();
}

function minimizePlayer() {
  player.style.height = '32px';
  player.style.overflow = 'hidden';
  saveState();
}

function maximizePlayer() {
  player.style.height = '';
  player.style.overflow = '';
  saveState();
}

function closePlayer() {
  const miniBtn = document.createElement('button');
  miniBtn.innerHTML = '<img src="tnt.png" alt="TNT" style="width: 96px; height: 96px; object-fit: contain; border: none;">';
  miniBtn.style.position = 'fixed';
  miniBtn.style.top = '140px';
  miniBtn.style.left = '0';
  miniBtn.style.zIndex = '10000';
  miniBtn.style.backgroundColor = 'transparent';
  miniBtn.style.border = 'none';
  miniBtn.style.cursor = 'pointer';
  miniBtn.style.boxShadow = 'none';

  const rect = player.getBoundingClientRect();
  const targetX = 0 - rect.left;
  const targetY = 140 - rect.top;

  player.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
  player.style.transformOrigin = 'top left';
  player.style.transform = `translate(${targetX}px, ${targetY}px) scale(0.05)`;
  player.style.opacity = '0';

  setTimeout(() => {
    player.style.display = 'none';
    document.body.appendChild(miniBtn);

    miniBtn.addEventListener('click', () => {
      player.style.display = 'block';
      player.style.opacity = '1';
      player.style.transform = 'none';
      miniBtn.remove();
      saveState();
    });
  }, 400);
  saveState(true);
}

function saveState(closed = false) {
  localStorage.setItem('cd-state', JSON.stringify({
    index: currentIndex,
    time: audio.currentTime,
    playing: !audio.paused,
    x: player.style.left,
    y: player.style.top,
    minimized: player.style.height === '32px',
    closed
  }));
}

document.addEventListener('DOMContentLoaded', initPlayer);
