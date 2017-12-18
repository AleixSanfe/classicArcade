let gameInterval = null;
let startButton = null;
let restartButton = null;
let stopButton = null;
let pauseButton = null;
let resumeButton = null;

const changeButtonDisplays = (start,restart,stop,pause,resume) => {
	startButton.parentNode.style.display = start;
	restartButton.parentNode.style.display = restart;
	stopButton.parentNode.style.display = stop;
	pauseButton.parentNode.style.display = pause;
	resumeButton.parentNode.style.display = resume;
}

let audioElement = null;
var playSoundEffect = (path) => {
	audioElement = document.createElement('audio');
	audioElement.setAttribute('src', path);
	audioElement.play();
}

var initializeEvents = (resetGame) => {

	startButton = document.getElementById('start');
	restartButton = document.getElementById('restart');
	stopButton = document.getElementById('stop');
	pauseButton = document.getElementById('pause');
	resumeButton = document.getElementById('resume');

	console.log(',');
	startButton.addEventListener('click',(event) => {
		resetGame();
		gameInterval = setInterval(game,1000 / framesPerSecond);

		changeButtonDisplays('none','','','','none');
		playSoundEffect('../resources/sound/menuSelection.wav');
	});

	restartButton.addEventListener('click',(event) => {
		clearInterval(gameInterval);
		resetGame();
		gameInterval = setInterval(game,1000 / framesPerSecond);

		changeButtonDisplays('none','','','','none');
		playSoundEffect('../resources/sound/menuSelection.wav');
	});

	stopButton.addEventListener('click',(event) => {
		clearInterval(gameInterval);

		changeButtonDisplays('','none','none','none','none');
		playSoundEffect('../resources/sound/menuSelection.wav');
	});

	pauseButton.addEventListener('click',(event) => {
		clearInterval(gameInterval);

		changeButtonDisplays('none','','','none','');
		playSoundEffect('../resources/sound/menuSelection.wav');
	});

	resumeButton.addEventListener('click',(event) => {
		gameInterval = setInterval(game,1000 / framesPerSecond);

		changeButtonDisplays('none','','','','none');
		playSoundEffect('../resources/sound/menuSelection.wav');
	});
}