// document.getElementById('audio').controls = true;

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
    playerControls.togglePlayPause();
  },
  
  getCurrentTime: function() {
    const time = this.audioElement.currentTime;
    return time;
  },
  
  getDuration: function() {
    const duration = Math.floor(this.audioElement.duration);
    return duration;
  },
  
  setVolume: function() {
    this.audioElement.volume = (playerControls.volume.value)/ 100;
  },

  setCurrentTime: function() {
    const e = window.event;
    const percent = (e.pageX / e.srcElement.clientWidth);
    this.audioElement.currentTime = this.audioElement.duration * percent;
  }
}

const playerControls = {
  playPauseButton: document.querySelector('.play-pause'),
  timeRemaining: document.getElementById('time-remaining'),
  time: document.getElementById('time'),
  timeTotal: document.getElementById('time-total'),
  volume: document.querySelector('.volume'),
  progressBar: document.getElementById('progressBar'),

  showPlaying: function() {
    const duration = audioController.getDuration();
    const now = audioController.getCurrentTime();
    if (duration) {
      this.progressBar.value = (now/duration)*100;
    }
  },

  play: function() {
    this.playPauseButton.classList.add('pause');
  },
  
  togglePlayPause: function() {
    this.playPauseButton.classList.toggle('pause');
  },
        
  setPlayTime: function() {
    this.time.textContent = formatTime(audioController.getCurrentTime());
  },

  setRemainingTime: function() {
    const duration = audioController.getDuration();
    const current = audioController.getCurrentTime()
    if ((duration-current) > 0) {
    this.timeRemaining.textContent = "- " + formatTime(duration - current);
    }
  },
  
  setDuration: function() {
    this.timeTotal.textContent = formatTime(audioController.getDuration());
    this.timeRemaining.textContent = formatTime(audioController.getDuration());
  }, 
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


function formatTime(time) {
  let seconds = Math.floor(time);
  let minutes = Math.floor(seconds / 60);
  minutes = (minutes >= 10) ? minutes : "0" + minutes;
  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  return minutes + ":" + seconds;
}

function songClicked(e) {
  currentSong.album = e.target.parentNode.getAttribute('data-album');
  currentSong.song = e.target.textContent;
  audioController.setAudio().play();
  playerControls.play();
  playerInfo.setPlayerInfo();
}

function handleSongList() {
  this.nextElementSibling.classList.toggle('show-songs');
}

const songs = document.querySelectorAll('ol li');
songs.forEach(song => song.addEventListener('click', songClicked));

const songLists = document.querySelectorAll('.selector-album');
songLists.forEach(list => list.addEventListener('click', handleSongList));

fetch("./cdn/data/data.JSON")
.then(res => res.json())
.then(data => console.log(data));