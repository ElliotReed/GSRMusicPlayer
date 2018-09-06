let albumData;

fetch("https://elliotreed.github.io/GSRMusicPlayer/cdn/data/data.json")
  .then(res => res.json())
  .then(data => {
    albumData = data;
  });

const currentSong = {
  album: "",
  song: ""
}

const media = new Audio();
const autoplay = false;

const playerInfo = document.querySelector('.player__info');

const nowTime = document.querySelector('.time__now');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress__filled');
const playPauseButton = document.querySelector('.play-pause');
const timeRemaining = document.querySelector('.time__remaining');
const volume = document.querySelector('.volume');

const player = document.querySelector('.player');
const selector = document.querySelector('.selector')

function setSelectorHeight() {
  const playerHeight = player.offsetHeight;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  // Set to media queries
  if (windowWidth < windowHeight) {
    if (windowWidth < 578) {
      selector.style.height = (windowHeight - playerHeight) + 'px';
    }
  } else {
    console.log(windowHeight);
    if ((windowHeight < 578)) {
      selector.style.height = (windowHeight) + 'px';
    }
  }
}

function populatePlayerInfo() {
  const album = albumData.filter(data => data.album === currentSong.album);
  const song = album[0].songs.filter(song => song.title === currentSong.song);
  const imagePath = "../cdn/images/"
  image = album[0].cover;
  playerInfo.innerHTML = `
    <div class="song-info__wrapper">
      <div class="loader"></div>
      <div class="album-cover">
        <img src="${imagePath + image}" class="cover__image" alt="album cover"/>
      </div>
      <div class="song-info">
        <div class="artist">Artist:
          <div>${album[0].artist}</div>
        </div>
        <div class="album">Album:
          <div>${album[0].album}</div>
        </div>
        <div class="song">Song:
          <div>${song[0].title}</div>
        </div>
      </div>
    </div>
    <div class="song-info__wrapper-reflection">
      <div class="album-cover__reflection">
        <img src="${imagePath + image}" class="cover__reflection"/>
      </div>
      <div class="song-info__reflection">
        <div class="artist">Artist:
          <div>${album[0].artist}</div>
        </div>
        <div class="album">Album:
          <div>${album[0].album}</div>
        </div>
        <div class="song">Song:
          <div>${song[0].title}</div>
        </div>
      </div>
    </div>
  `;
}

function setAudio() {
  media.src = "./cdn/sounds/" + currentSong.album + "/" + currentSong.song + ".m4a";
  return media;
}

function togglePlaySong() {
  if (!media.paused) {
    media.pause();
  } else {
    media.play();
  }
}

function handleProgress() {
  const percent = (media.currentTime / media.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function setCurrentTime(e) {
  const newTime = (e.offsetX / progress.offsetWidth) * media.duration;
  media.currentTime = newTime;
}

function mediaEnded() {
  if (!autoplay) {
    media.currentTime = 0;
  }
}

function formatTime(time) {
  let seconds = Math.floor(time);
  let minutes = Math.floor(seconds / 60);
  minutes = (minutes >= 10) ? minutes : "0" + minutes;
  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  return minutes + ":" + seconds;
}

function getCurrentTime() {
  return media.currentTime;
}

function getDuration() {
  const duration = Math.floor(media.duration);
  return duration;
}

function setDuration() {
  timeRemaining.textContent = formatTime(getDuration());
}

function setPlayTime() {
  nowTime.textContent = formatTime(media.currentTime);
}

function setRemainingTime() {
  const duration = getDuration();
  const current = getCurrentTime()
  if ((duration - current) > 0) {
    timeRemaining.textContent = formatTime(duration - current);
  }
}

function setVolume() {
  media.volume = volume.value / 100;
}

function togglePlayPause() {
  if (!media.paused) {
    playPauseButton.classList.add('pause');
  } else {
    playPauseButton.classList.remove('pause');
  }
}

function handleSongList() {
  this.nextElementSibling.classList.toggle('show-songs');
}

function songClicked(e) {
  currentSong.album = e.target.parentNode.getAttribute('data-album');
  currentSong.song = e.target.textContent;
  setAudio().play();
  populatePlayerInfo();
}

function removeLoader() {
  const loader = document.querySelector('.loader');
  loader.parentNode.removeChild(loader);
}

setSelectorHeight();

window.addEventListener("deviceorientation", setSelectorHeight);

const songs = document.querySelectorAll('ol li');
songs.forEach(song => song.addEventListener('click', songClicked));

const songLists = document.querySelectorAll('.selector-album');
songLists.forEach(list => list.addEventListener('click', handleSongList));


// media.addEventListener('loadeddata', setDuration);
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
playPauseButton.addEventListener('click', togglePlaySong);
volume.addEventListener('change', setVolume);

let mousedown = false;
progress.addEventListener('click', setCurrentTime);
progress.addEventListener('mousemove', (e) => mousedown && setCurrentTime(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);