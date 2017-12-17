
let canvas;
let canvasContext;

let framesPerSecond = 60;

let ball = {
	x: 0,
	y: 0,
	size: {
		x: 30,
		y: 30
	},
	motion: {
		x: 5,
		y: 5
	}
}


window.onload = function(){

	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	setInterval(game,1000 / framesPerSecond);
}

const centerY = (ySize) => {
	return (canvas.height - ySize) / 2;
}

const game = () => {

	const nextTurn = () => {

		ball.x += ball.motion.x;
		ball.y += ball.motion.y;

		if( (ball.x + ball.motion.x) < 0 || (ball.x + ball.size.x + ball.motion.x) > canvas.width ) ball.motion.x *= -1;

		if( (ball.y + ball.motion.y) < 0 || (ball.y + ball.size.y + ball.motion.y) > canvas.height ) ball.motion.y *= -1;

	}

	const render = () => {

		canvasContext.fillStyle = 'black';
		canvasContext.fillRect(0,0,canvas.width,canvas.height);

		canvasContext.fillStyle = 'red';
		canvasContext.fillRect( ball.x, ball.y, ball.size.x,ball.size.y);

	}

	render();
	nextTurn();

}