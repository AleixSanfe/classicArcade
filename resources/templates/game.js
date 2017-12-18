
let canvas;
let canvasContext;

let framesPerSecond = 60;

window.onload = function(){

	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	initializeEvents(resetGame);
}

const game = () => {

	const nextFrame = () => {

	}

	const render = () => {

		canvasContext.fillStyle = 'black';
		canvasContext.fillRect(0,0,canvas.width,canvas.height);
	}

	render();
	nextFrame();
}

const resetGame = () => {

}