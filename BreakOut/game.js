
let canvas;
let canvasContext;

let framesPerSecond = 60;

const COLORS = [ 'rgba(255,0,0,1)' , 'rgba(255,255,0,1)', 'rgba(0,255,0,1)', 'rgba(0,255,255,1)', 'rgba(0,0,255,1)', 'rgba(255,0,255,1)' ];

let lives = 3;

let playerPadle = { x: 350, y: 580, width: 100, height: 10, color: 'white'};
let wallPadles = [];

let ball = {
	x: 0,
	y: 0,
	radius: 10,
	motion: {
		x: 0,
		y: 5
	},
	color: 'white'
}

window.onload = function(){

	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	initializeEvents(resetGame);

	canvas.addEventListener('mousemove',(event) => {

		let mouseX = calculateMousePos(event).x;
		let posX = mouseX;

		if( (mouseX - (playerPadle.width / 2) ) < 0 ) posX = 0;
		else if( (mouseX + playerPadle.width ) > canvas.width ) posX = (canvas.width - playerPadle.width);
		else posX = mouseX - playerPadle.width/2;

		playerPadle.x = posX;
	});
}

const game = () => {

	const ballColidesPadle = (x,padle) => {

		return ( padle.x <= x && x <= (padle.x+padle.width) );
	}

	const ballColidesAnyWall = (x,y) => {

		for(let i = 0; i < wallPadles.length; ++i){

			let padle = wallPadles[i];
			if( padle.life > 0 && padle.x <= x && x <= (padle.x + padle.width) && padle.y <= y && y <= (padle.y + padle.height) ){

				padle.life -= 1;

				let relX = x - padle.x;
				let relY = y - padle.y;

				let relPWX = padle.width;
				let relPHY = padle.height;

				let RATIO = relPHY/relPWX;

				if( relY <= (relPHY/2) && relY <= RATIO*relX  			&& relY <= (relPWX-relX)*RATIO ) 	return 1;
				if( relX >  (relPWX/2) && relY <  RATIO*relX  			&& relY >  (relPWX-relX)*RATIO ) 	return 2;
				if( relY >= (relPHY/2) && relY >= (relPWX-relX)*RATIO 	&& relY >= RATIO*relX ) 			return 3;
				if( relX <  (relPWX/2) && relY >  RATIO*relX  			&& relY <  (relPWX-relX) ) 			return 4;
			}
		}
		return -1;
	}

	const nextFrame = () => {

		ball.x += ball.motion.x;
		ball.y += ball.motion.y;

		if( (ball.x + ball.motion.x) < 0 || (ball.x + ball.radius + ball.motion.x) > canvas.width ) ball.motion.x *= -1;

		if( (ball.y + ball.motion.y) > canvas.height ){
			--lives;
			ball.motion.y *= -1;
			//TODO: if lives == 0 => stopGame();
		}

		if( (ball.y + ball.motion.y) < 0 ) ball.motion.y *= -1;

		if( (ball.y + ball.motion.y) > playerPadle.y && ballColidesPadle(ball.x,playerPadle) ){
			playSoundEffect('../resources/sound/endpointHit.flac');
			ball.motion.y *= -1;
			let deltaX = ball.x - (playerPadle.x + playerPadle.width/2);
			ball.motion.x = deltaX * 0.15;
		}

		let r = ballColidesAnyWall(ball.x,ball.y,ball.radius);
		if( r != -1 ) (r%2 == 0) ? (ball.motion.x *= -1) : (ball.motion.y *= -1) ;

	}

	const printPadle = (padle) => {

		canvasContext.fillStyle = padle.color;
		canvasContext.fillRect(padle.x,padle.y,padle.width,padle.height);
	}

	const printWallPadle = (padle) => {

		canvasContext.fillStyle = COLORS[ (padle.life - 1) % COLORS.length ];
		canvasContext.fillRect(
			padle.x + padle.margin,
			padle.y + padle.margin,
			padle.width - (padle.margin*2),
			padle.height - (padle.margin*2)
		);
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
		printPadle(playerPadle);

		printBall(ball);

		for(let i = 0; i < wallPadles.length; ++i){
			(wallPadles[i].life > 0) ? printWallPadle(wallPadles[i]) : '';
		}
	}

	render();
	nextFrame();
}

const resetGame = () => {

	wallPadles = [];

	for(let i = 0; i < 6; i++){
		for(let j = 0; j < (canvas.width / 100); j++){

			let newPadle = { x: 350, y: 200, width: 100, height: 20,margin: 1, life: 6};
			newPadle.x = ( j * 100);
			newPadle.y = ( (i+2) * 20 );
			newPadle.life -= (i + 1);
			wallPadles.push(newPadle);
		}
	}

	ball.x = canvas.width/2;
	ball.y = canvas.height*0.75;
}