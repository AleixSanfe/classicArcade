
let canvas;
let canvasContext;

let framesPerSecond = 60;

let ball = {
	x: 0,
	y: 0,
	radius: 10,
	motion: {
		x: 5,
		y: 5
	}
}

let leftPadle = {
	x: 5,
	y: 250,
	width: 10,
	height: 100,
	color: 'white'
}

let rightPadle = {
	x: 785,
	y: 250,
	width: 10,
	height: 100,
	color: 'white'
}

window.onload = function(){

	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	setInterval(game,1000 / framesPerSecond);
}

const game = () => {

	const nextFrame = () => {

		ball.x += ball.motion.x;
		ball.y += ball.motion.y;

		if( (ball.x + ball.motion.x) < 0 || (ball.x + ball.radius + ball.motion.x) > canvas.width ) ball.motion.x *= -1;
		if( (ball.y + ball.motion.y) < 0 || (ball.y + ball.radius + ball.motion.y) > canvas.height ) ball.motion.y *= -1;

	}

	const printLines = (numberOfLines,x,width,color) => {

		for(let i = 0; i < numberOfLines; ++i){
			canvasContext.fillStyle = color;
			canvasContext.fillRect(x, (canvas.height/numberOfLines)*i + (canvas.height/(numberOfLines*4) ) , width, (canvas.height/(numberOfLines*2)));
		}
	}

	const printPadle = (padle) => {

		canvasContext.fillStyle = padle.color;
		canvasContext.fillRect(padle.x,padle.y,padle.width,padle.height);
	}

	const printBall = () => {

		canvasContext.fillStyle = 'white';
		canvasContext.beginPath();
		canvasContext.arc(ball.x,ball.y,ball.radius,0,2*Math.PI);
		canvasContext.fill();
	}

	const render = () => {

		canvasContext.fillStyle = 'black';
		canvasContext.fillRect(0,0,canvas.width,canvas.height);

		printLines(20,9,2,'white');
		printLines(20,canvas.width/2 - 1,2,'white');
		printLines(20,canvas.width - 11,2,'white');

		printBall();

		printPadle(leftPadle);
		printPadle(rightPadle);

	}

	render();
	nextFrame();

}