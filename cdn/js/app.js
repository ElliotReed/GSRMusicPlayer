let albumData;

const current = {
  album: {},
  track: {},
}

function getAlbumData() {
  return fetch("https://elliotreed.github.io/GSRMusicPlayer/cdn/data/data.json")
    .then(res => res.json())
}

async function init() {
  albumData = await getAlbumData()
  current.album = albumData[0];
  current.track = current.album.songs[0];
  setAudio()
  populatePlayerInfo();
  insertAlbums(albumData);
  selector.addEventListener('click', handleSelectorClick)
}

// #region  PLAYER
// #region  Display
const display = document.querySelector('[data-display]');
const playerDisplay = {
  "albumTitle": display.querySelector('[data-album]'),
  "coverImage": display.querySelector('[data-image]'),
  "coverImageReflection": display.querySelector('[data-image-reflection]'),
  "songTitle": display.querySelector('[data-track]'),
}

function populatePlayerInfo() {
  const imagePath = "cdn/images/"
  image = current.album.cover + "-250.jpg";
  playerDisplay.albumTitle.textContent = current.album.title;
  playerDisplay.coverImage.src = imagePath + image;
  playerDisplay.coverImage.alt = current.album.alt;
  playerDisplay.coverImageReflection.src = imagePath + image;
  playerDisplay.songTitle.textContent = current.track.title;
}

function addLoader() {
  const loader = document.createElement('div');
  loader.setAttribute('class', 'loader');
  loader.dataset.loader = true;
  display.prepend(loader);
}

function removeLoader() {
  const loader = document.querySelector('[data-loader]');
  loader?.parentNode.removeChild(loader);
}
// #endregion Display
// #region Controls
const player = document.querySelector('[data-player]');
const playerControls = {
  "nowTime": player.querySelector('[data-time-now]'),
  "playPauseButton": player.querySelector('[data-play-pause]'),
  "progress": player.querySelector('[data-progress]'),
  "progressBar": player.querySelector('[data-progress-filled]'),
  "timeRemaining": player.querySelector('[data-time-remaining]'),
  "volume": player.querySelector('[data-volume]'),
}

const media = new Audio();
const autoplay = false;

function setAudio() {
  media.src =
    "./cdn/sounds/" + current.album.title + "/" + current.track.source;
  return media;
}

function togglePlaySong() {
  if (!media.paused) {
    media.pause();
  } else {
    media.play();
  }

  return true;
}

function handleProgress() {
  const percent = (media.currentTime / media.duration) * 100;
  playerControls.progressBar.style.flexBasis = `${percent}%`;

  return true;
}

function setCurrentTime(e) {
  const newTime = (e.offsetX / playerControls.progress.offsetWidth) * media.duration;
  media.currentTime = newTime;

  return true;
}

function mediaEnded() {
  if (!autoplay) {
    media.currentTime = 0;
  }

  return true;
}

function formatTime(time) {
  const totalSeconds = Math.floor(time);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const minutesString = String(minutes).padStart(2, 0);
  const secondsString = String(seconds).padStart(2, 0);

  return minutesString + ":" + secondsString;
}

function getCurrentTime() {
  return media.currentTime;
}

function getDuration() {
  return Math.floor(media.duration);
}

function setDuration() {
  playerControls.timeRemaining.textContent = formatTime(getDuration());

  return true;
}

function setPlayTime() {
  playerControls.nowTime.textContent = formatTime(media.currentTime);

  return true;
}

function setRemainingTime() {
  const duration = getDuration();
  const current = getCurrentTime();

  if ((duration - current) > 0) {
    playerControls.timeRemaining.textContent = formatTime(duration - current);
  }

  return true;
}

function setVolume() {
  media.volume = playerControls.volume.value / 100;

  return true;
}

function togglePlayPause() {
  if (!media.paused) {
    playerControls.playPauseButton.classList.add('pause');
  } else {
    playerControls.playPauseButton.classList.remove('pause');
  }

  return true;
}
// #endregion Controls
// #region Media
media.addEventListener('timeupdate', () => {
  setPlayTime();
  setRemainingTime();
  handleProgress();
});
media.addEventListener('loadeddata', () => {
  setDuration();
  removeLoader();
});
media.addEventListener('play', togglePlayPause);
media.addEventListener('pause', togglePlayPause);
media.addEventListener('ended', () => {
  mediaEnded();
  togglePlayPause();
});
playerControls.playPauseButton.addEventListener('click', togglePlaySong);
playerControls.volume.addEventListener('change', setVolume);

let mousedown = false;
playerControls.progress.addEventListener('click', setCurrentTime);
playerControls.progress.addEventListener('mousemove', (e) => mousedown && setCurrentTime(e));
playerControls.progress.addEventListener('mousedown', () => mousedown = true);
playerControls.progress.addEventListener('mouseup', () => mousedown = false);
// #endregion Media
//#endregion PLAYER 
// #region SELECTOR
const selector = document.querySelector('[data-selector]');
const selectList = selector.querySelector('[data-select-list]');

function insertAlbums(albumData) {
  let albumHtml = ``;

  albumData.map(album => {
    albumHtml += `
    <li class="selector__album">
          <header class="album__header" data-album-header>
            <img src="cdn/images/${album.cover}-100.jpg"
              alt="${album.alt}">

            <p>${album.title}</p>
            <div data-album-header-button>&#10094</div>
          </header>

          <ol class="album__song-list" data-id="${album.id}">
            ${album.songs.map(song => `<li class="album__song" data-track="${song.track}">${song.title}</li>`).join('')}
          </ol>
        </li>
    `;
  })

  selectList.innerHTML = albumHtml;

  return true;
}

function setCurrent(id, track) {
  current.album = albumData[id];
  current.track = current.album.songs[track - 1]
}

function clearSelecteClass() {
  const songs = selectList.querySelectorAll('[data-track]');
  [...songs].map(song => {
    if (song.classList.contains('selected')) {
      song.classList.remove('selected')
    }
  });

  return true;
}

function handleSelectorClick(e) {
  const target = e.target;

  if (target.matches('[data-album-header]')) {
    target.nextElementSibling.classList.toggle('show-songs');
    const headerButton = target.querySelector('[data-album-header-button]');
    headerButton.classList.toggle('opened');
  }

  if (target.parentNode?.matches('[data-id]')) {
    addLoader();
    clearSelecteClass();
    target.classList.add('selected');
    const id = target.parentNode.dataset.id;
    const track = target.dataset.track;
    setCurrent(id, track)
    setAudio().play();
    populatePlayerInfo();
  }

  return true;
}
// #endregion SELECTOR

init();