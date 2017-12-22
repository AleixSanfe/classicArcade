
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
	},
	color: 'white'
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
	/*document.addEventListener('keydown',(event) => {
		//console.log('HEY');
		switch(event.keyCode){
			case 38:
				leftPadle.y -= 15;
				break;
			case 40:
				leftPadle.y += 15;
				break;
		}
	},false);*/

	canvas.addEventListener('mousemove',(event) => {

		let mouseY = calculateMousePos(event).y;
		let posY = mouseY;

		if( (mouseY - (leftPadle.height / 2) ) < 0 ) posY = 0;
		else if( (mouseY + leftPadle.height ) > canvas.height ) posY = (canvas.height - leftPadle.height);
		else posY = mouseY - leftPadle.height/2;

		leftPadle.y = posY;
	});
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
			ball.motion.y = deltaY * 0.2;
		}
		if( (ball.x + ball.radius + ball.motion.x) > (canvas.width - 15) && ballColidesPadle(ball.y,rightPadle) ){
			playSoundEffect('../resources/sound/endpointHit.flac');
			ball.motion.x *= -1;
			let deltaY = ball.y - (rightPadle.y + rightPadle.height/2);
			ball.motion.y = deltaY * 0.2;
		}
	}

	const moveRightPadle = () => {

		const predictYcoord = () => {

			/*let phantomBall = { x: 0, y: 0, radius: 10, motion: { x: 5, y: 5 }, color: 'white' };
			phantomBall.color = 'red';*/

			let phantomMotion = {x: ball.motion.x, y: ball.motion.y};
			let phantomPosition = {x: ball.x, y: ball.y};

			for(let i = 1; i < 25; ++i){
				phantomPosition.x = (phantomMotion.x) + phantomPosition.x;
				phantomPosition.y = (phantomMotion.y) + phantomPosition.y;

				if( (phantomPosition.x + phantomMotion.x) < 0 || (phantomPosition.x + phantomMotion.x) > canvas.width ) phantomMotion.x *= -1;
				if( (phantomPosition.y + phantomMotion.y) < 0 || (phantomPosition.y + phantomMotion.y) > canvas.height ) phantomMotion.y *= -1;

				/*phantomBall.x = phantomPosition.x;
				phantomBall.y = phantomPosition.y;
				printBall(phantomBall);*/

				if( phantomPosition.x == 0 || phantomPosition.x == canvas.width) return phantomPosition.y;
			}
			return null
		}

		let predictedYcoord = predictYcoord();

		if(predictedYcoord){
			if( (predictedYcoord) < rightPadle.y+(rightPadle.height/2) ) rightPadle.y -= 5;
			if( (predictedYcoord) > rightPadle.y+(rightPadle.height/2) ) rightPadle.y += 5;

		} else{
			if( (ball.y) < rightPadle.y+(rightPadle.height/2) ) rightPadle.y -= 5;
			if( (ball.y) > rightPadle.y+(rightPadle.height/2) ) rightPadle.y += 5;
		}
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

	const printBall = (bBall) => {

		canvasContext.fillStyle = bBall.color;
		canvasContext.beginPath();
		canvasContext.arc(bBall.x,bBall.y,bBall.radius,0,2*Math.PI);
		canvasContext.fill();
	}

	const render = () => {

		canvasContext.fillStyle = 'black';
		canvasContext.fillRect(0,0,canvas.width,canvas.height);

		printLines(20,9,2,'white');
		printLines(20,canvas.width/2 - 1,2,'white');
		printLines(20,canvas.width - 11,2,'white');

		printBall(ball);

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

