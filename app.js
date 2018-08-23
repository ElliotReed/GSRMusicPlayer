document.getElementById('audio').controls = true;
function playSong() {
  const audio = document.getElementById('audio');
  audio.play();
}

function stopSong() {
  const audio = document.getElementById('audio');
  audio.currentTime = 0;
}

function setPlayerInfo(album, song) {
  const cover = document.querySelector('.album-cover img');
  const songTitle = document.querySelector('.song span');
  const albumTitle = document.querySelector('.album span');

  cover.src = "./cdn/images/" + album + ".jpg";
  albumTitle.textContent = album;
  songTitle.textContent = song;
}
function songClicked(e) {
  const album = e.target.parentNode.getAttribute('data-album');
  const song = e.target.textContent;
  const audio = document.getElementById('audio');
  audio.src = "./cdn/sounds/" + album + "/" + song + ".m4a";
  audio.play(); 
  setPlayerInfo(album, song);
}

const songs = document.querySelectorAll('ol li');
songs.forEach(song => song.addEventListener('click', songClicked));