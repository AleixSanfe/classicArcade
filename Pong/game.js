
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

let leftScore = 0;
let rightScore = 0;

window.onload = function(){

	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	initializeEvents(resetGame);

	resetBall();
	canvas.addEventListener('mousemove',(event) => {

		let mouseY = calculateMousePos(event).y;
		let posY = mouseY;

		if( (mouseY - (leftPadle.height / 2) ) < 0 ) posY = 0;
		else if( (mouseY + leftPadle.height ) > canvas.height ) posY = (canvas.height - leftPadle.height);
		else posY = mouseY - leftPadle.height/2;

		leftPadle.y = posY;
	});
}

const calculateMousePos = (event) => {
	let canvasBCR = canvas.getBoundingClientRect();
	let documentRoot = document.documentElement;
	return {
		x: event.clientX - canvasBCR.left - documentRoot.scrollLeft,
		y: event.clientY - canvasBCR.top - documentRoot.scrollTop
	}
}

const resetBall = () => {

	let leftElementScore = document.getElementById('leftScore');
	leftElementScore.innerHTML = leftScore;

	let rightElementScore = document.getElementById('rightScore');
	rightElementScore.innerHTML = rightScore;

	ball.x = (canvas.width - ball.radius)/2;
	ball.y = (canvas.height - ball.radius)/2;

	let Rx = Math.random();
	let Ry = Math.random();

	ball.motion.x = 5 * ( ( parseInt(Rx * 10) % 2 == 0) ? 1 : -1 );
	ball.motion.y = 5 * ( ( parseInt(Ry * 10) % 2 == 0) ? 1 : -1 );
}

const game = () => {

	const ballColidesPadle = (y,padle) => {

		return (padle.y <= y && (padle.y+padle.height) >= y);
	}

	const nextFrame = () => {

		ball.x += ball.motion.x;
		ball.y += ball.motion.y;

		if( (ball.x + ball.motion.x) < 0 ){
			rightScore++;
			playSoundEffect('../resources/sound/point.mp3');
			resetBall();
		}
		if( (ball.x + ball.radius + ball.motion.x) > canvas.width ){
			leftScore++;
			playSoundEffect('../resources/sound/point.mp3');
			resetBall();
		}

		if( (ball.y + ball.motion.y) < 0 || (ball.y + ball.radius + ball.motion.y) > canvas.height ) ball.motion.y *= -1;

		if( (ball.x + ball.motion.x) < 15 && ballColidesPadle(ball.y,leftPadle) ){
			playSoundEffect('../resources/sound/endpointHit.flac');
			ball.motion.x *= -1;
			let deltaY = ball.y - (leftPadle.y + leftPadle.height/2);
			ball.motion.y = deltaY * 0.3;
		}
		if( (ball.x + ball.radius + ball.motion.x) > (canvas.width - 15) && ballColidesPadle(ball.y,rightPadle) ){
			playSoundEffect('../resources/sound/endpointHit.flac');
			ball.motion.x *= -1;
			let deltaY = ball.y - (rightPadle.y + rightPadle.height/2);
			ball.motion.y = deltaY * 0.3;
		}
	}

	const moveRightPadle = () => {
		if( (ball.y+20) < rightPadle.y+(rightPadle.height/2) ) rightPadle.y -= 6;
		if( (ball.y-20) > rightPadle.y+(rightPadle.height/2) ) rightPadle.y += 6;
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
	moveRightPadle();
}

const resetGame = () => {
	leftScore = 0;
	rightScore = 0;
	resetBall();
}