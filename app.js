document.getElementById('audio').controls = true;

const currentSong = {
  album: "",
  song: ""
}

const audioController = {
  audioElement: document.getElementById('audio'),

  setAudio: function() {
    this.audioElement.src = "./cdn/sounds/" + currentSong.album + "/" + currentSong.song + ".m4a"; 
    return this.audioElement;
  }, 
  
  togglePlaySong: function() {
    if (!this.audioElement.paused) {
      this.audioElement.pause();
    } else {
      this.audioElement.play();
    }
    controls.togglePlayPause();
  }
}

const controls = {
  playPauseButton: document.querySelector('.play-pause'),
  timeRemaining: document.getElementById('time-remaining'),

  play: function() {
    this.playPauseButton.classList.add('pause');
  },

  togglePlayPause: function() {
    this.playPauseButton.classList.toggle('pause');
  }
}

const playerInfo = {
  cover: document.querySelector('.album-cover img'),
  songTitle: document.querySelector('.song span'),
  albumTitle: document.querySelector('.album span'),

  setPlayerInfo: function() {
    this.cover.src = "./cdn/images/" + currentSong.album + ".jpg";
    this.albumTitle.textContent = currentSong.album;
    this.songTitle.textContent = currentSong.song;
  }
}


function stopSong() {
  const audio = document.getElementById('audio');
  audio.currentTime = 0;
}

function updateTime() {
  const audio = document.getElementById('audio');
  const time = document.getElementById('time');
  const seconds = Math.floor(audio.currentTime);
  const audioInSeconds = formatTime(seconds);
  time.textContent = audioInSeconds;
}


function setDuration() {
  const audio = document.getElementById('audio');
  const timeTotal = document.getElementById('time-total');
  timeTotal.textContent = audio.duration;
} 


function formatTime(seconds) {
  minutes = Math.floor(seconds / 60);
  minutes = (minutes >= 10) ? minutes : "0" + minutes;
  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  return minutes + ":" + seconds;
}

function songClicked(e) {
  currentSong.album = e.target.parentNode.getAttribute('data-album');
  currentSong.song = e.target.textContent;
  audioController.setAudio().play();
  controls.play();
  playerInfo.setPlayerInfo();
}

const songs = document.querySelectorAll('ol li');
songs.forEach(song => song.addEventListener('click', songClicked));