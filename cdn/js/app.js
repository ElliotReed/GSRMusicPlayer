let albumData;

fetch("./cdn/data/data.JSON")
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

const placeholder = document.querySelector('.placeholder__image');
const placeholderReflection = document.querySelector('.placeholder__reflection');
const cover = document.querySelector('.cover__image');
const coverReflection = document.querySelector('.cover__reflection');
const songTitle = document.querySelector('.song span');
const albumTitle = document.querySelector('.album span');
const timeTotal = document.getElementById('time__total');

const nowTime = document.querySelector('.time__now');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress__filled');
const playPauseButton = document.querySelector('.play-pause');
const timeRemaining = document.querySelector('.time__remaining');
const volume = document.querySelector('.volume');

const player = document.querySelector('.player');
const selector = document.querySelector('.selector')
// const cssProperties = document.documentElement;

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

function setPlayerInfo() {
  albumTitle.textContent = currentSong.album;
  songTitle.textContent = currentSong.song;
  setCover();
}

function setCover() {
  const album = albumData.filter(data => data.album === currentSong.album)
  image = "/cdn/images/" + album[0].cover;
  placeholder.style.display = 'none';
  placeholderReflection.style.display = 'none';
  cover.src = image;
  coverReflection.src = image;
  cover.style.display = 'block';
  coverReflection.style.display = 'block';
}

function setPlacehoderHeight() {
  placeholder.style.height = placeholder.offsetWidth + 'px';
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

function setDuration() {
  timeTotal.textContent = formatTime(getDuration());
  timeRemaining.textContent = formatTime(getDuration());
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
  setPlayerInfo();
}

setSelectorHeight();
setPlacehoderHeight();

window.addEventListener("deviceorientation", setSelectorHeight);
window.addEventListener('resize', setPlacehoderHeight);
const songs = document.querySelectorAll('ol li');
songs.forEach(song => song.addEventListener('click', songClicked));

const songLists = document.querySelectorAll('.selector-album');
songLists.forEach(list => list.addEventListener('click', handleSongList));


media.addEventListener('loadeddata', setDuration);
media.addEventListener('timeupdate', () => {
  setPlayTime();
  setRemainingTime();
  handleProgress();
});
media.addEventListener('loadeddata', setDuration);
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