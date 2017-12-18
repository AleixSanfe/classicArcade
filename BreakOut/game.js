
let canvas;
let canvasContext;

let framesPerSecond = 60;

let playerPadle = { x: 350, y: 580, width: 100, height: 10, color: 'white'};
let wallPadles = [];

window.onload = function(){

	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	initializeEvents(resetGame);
}

const game = () => {

	const nextFrame = () => {

	}

	const printPadle = (padle) => {

		canvasContext.fillStyle = padle.color;
		canvasContext.fillRect(padle.x,padle.y,padle.width,padle.height);
	}

	const printWallPadle = (padle) => {

		canvasContext.fillStyle = 'rgba(255,127,127,1)';
		canvasContext.fillRect(
			padle.x + padle.margin,
			padle.y + padle.margin,
			padle.width - (padle.margin*2),
			padle.height - (padle.margin*2)
		);

		canvasContext.fillStyle = 'rgba(255,0,0,1)';
		canvasContext.fillRect(
			padle.x + padle.padding + padle.margin,
			padle.y + padle.padding + padle.margin,
			padle.width - ( (padle.padding+padle.margin)*2 ),
			padle.height - ( (padle.padding+padle.margin)*2 )
		);
	}

	const render = () => {

		canvasContext.fillStyle = 'black';
		canvasContext.fillRect(0,0,canvas.width,canvas.height);
		printPadle(playerPadle);

		for(let i = 0; i < wallPadles.length; ++i){
			(wallPadles[i].alive) ? printWallPadle(wallPadles[i]) : '';
		}
		
	}

	render();
	nextFrame();
}

const resetGame = () => {

	wallPadles = [];
	for(let i = 0; i < 4; i++){
		for(let j = 0; j < (canvas.width / 100); j++){

			let newPadle = { x: 350, y: 200, width: 100, height: 20, color: {r: 255, g: 0, b: 0, a: 1},borderColor: {r: 255, g: 127, b: 127, a: 1}, padding: 3,margin: 1, life: 5, alive: true};
			newPadle.x = ( j * 100);
			newPadle.y = ( (i+2) * 20 );
			newPadle.life -= i;
			wallPadles.push(newPadle);
		}
	}
}