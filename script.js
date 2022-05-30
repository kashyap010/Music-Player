const image = document.getElementById('image'),
	scrollContainerTitle = document.querySelector('.scroll-container-title'),
	title = document.getElementById('title'),
	titleScroller = document.getElementById('title-scroller'),
	scrollContainerArtist = document.querySelector('.scroll-container-artist'),
	artist = document.getElementById('artist'),
	artistScroller = document.getElementById('artist-scroller'),
	audioElement = document.getElementById('song'),
	currentTime = document.getElementById('current-time'),
	duration = document.getElementById('duration'),
	progressBarContainer = document.getElementById('progress-bar-container'),
	progressBar = document.getElementById('progress-bar'),
	previousBtn = document.getElementById('previous'),
	pauseBtn = document.getElementById('pause'),
	nextBtn = document.getElementById('next');

let isPlaying = false,
	currTrack = 0;

import { songs } from './songsList.js';

// FUNCTIONS
function playSong() {
	isPlaying = true;
	audioElement.play();
}

function pauseSong() {
	isPlaying = false;
	audioElement.pause();
}

function loadNextSong() {
	currTrack++;
	if (currTrack === songs.length) currTrack = 0;
	setDetails();
	checkIfPlaying();
}

function loadPreviousSong() {
	currTrack--;
	if (currTrack === -1) currTrack = songs.length - 1;
	setDetails();
	checkIfPlaying();
}

function checkIfPlaying() {
	if (isPlaying) audioElement.play();
}

function setDetails() {
	//progress = 0 initially
	progressBar.style.width = '0%';

	image.src = `./images/${songs[currTrack].image}`;

	audioElement.src = `./songs/${songs[currTrack].name}`;

	//set title and check if scroll animation required
	title.innerHTML = songs[currTrack].title;
	checkScrollAnimation(title, scrollContainerTitle, titleScroller, 'title');

	//set artist and check if scroll animation required
	artist.innerHTML = songs[currTrack].artist;
	checkScrollAnimation(artist, scrollContainerArtist, artistScroller, 'artist');
}

function checkScrollAnimation(elem1, parent, elem2, key) {
	if (elem1.getBoundingClientRect().width >= parent.getBoundingClientRect().width) {
		//insert &nbsp for proper spacing
		elem1.innerHTML = `${songs[currTrack][`${key}`]} &nbsp; `;
		elem2.innerHTML = `&nbsp; ${songs[currTrack][`${key}`]} &nbsp; `;
		//add marquee animation
		elem1.classList.add('show-animation');
		elem2.classList.add('show-animation-scroller');
	} else {
		elem1.classList.remove('show-animation');
		elem2.classList.remove('show-animation-scroller');
	}
}

// https://stackoverflow.com/a/37770048
function formatToMSS(s) {
	return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
}

function handleTimeUpdate(e) {
	if (isPlaying) {
		let { currentTime: time, duration: dur } = e.srcElement;
		currentTime.innerText = formatToMSS(Math.floor(time));
		duration.innerText = formatToMSS(Math.floor(dur));
		progressBar.style.width = `${time / dur * 100}%`;
		if (time === dur) loadNextSong();
	}
}

function handleProgressBar(e) {
	let left = progressBarContainer.getBoundingClientRect().left;
	let percent = (e.clientX - left) / 320;
	progressBar.style.width = `${percent * 100}%`;
	audioElement.currentTime = percent * audioElement.duration;
}

function handlePause() {
	if (!isPlaying) {
		pauseBtn.children[0].classList.replace('fa-play', 'fa-pause');
		playSong();
	} else {
		pauseBtn.children[0].classList.replace('fa-pause', 'fa-play');
		pauseSong();
	}
}

//EVENTS
window.onload = () => {
	setDetails();
};
audioElement.addEventListener('timeupdate', handleTimeUpdate);
progressBarContainer.addEventListener('click', handleProgressBar);
pauseBtn.addEventListener('click', handlePause);
nextBtn.addEventListener('click', () => loadNextSong());
previousBtn.addEventListener('click', () => loadPreviousSong());
