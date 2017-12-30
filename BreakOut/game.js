
let canvas;
let canvasContext;

let framesPerSecond = 60;

const COLORS = [ 'rgba(255,0,0,1)' , 'rgba(255,255,0,1)', 'rgba(0,255,0,1)', 'rgba(0,255,255,1)', 'rgba(0,0,255,1)', 'rgba(255,0,255,1)' ];

let lives = 30;

let playerPadle = { x: 350, y: 580, width: 100, height: 10, color: 'white'};

let wallPadles = [];
const WALL_PADLE_HEIGHT = 30;
const WALL_PADLE_WIDTH = 100;

let ball = {
    x: 0,
    y: 0,
    radius: 5,
    motion: {
        x: 0,
        y: 6
    },
    color: 'white'
}

window.onload = function(){

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    canvasContext.font = "50px Arcade";
    canvasContext.fillStyle = "red";
    canvasContext.fillText("Hello World",10,50);

    canvas.addEventListener('mousemove',(event) => {

        let mouseX = calculateMousePos(event).x;
        let posX = mouseX;

        if( (mouseX - (playerPadle.width / 2) ) < 0 ) posX = 0;
        else if( (mouseX + playerPadle.width ) > canvas.width ) posX = (canvas.width - playerPadle.width);
        else posX = mouseX - playerPadle.width/2;

        playerPadle.x = posX;
    });

    let isGameRuning = false;
    let isNewGame = true;
    let gameInterval = null;
    window.addEventListener('keypress',(event) => {
        if(event.keyCode == 32){
            if(!isGameRuning){
                if(isNewGame)resetGame();
                isNewGame=false;
                gameInterval = setInterval(game,1000 / framesPerSecond);
                isGameRuning=true;
            }else{
                clearInterval(gameInterval);
                isGameRuning=false;
            }
        }
    });
}

const game = () => {

    const ballColidesPadle = (x,padle) => {

        return ( padle.x <= x && x <= (padle.x+padle.width) );
    }

    const ballColidesAnyWall = (x,y,r) => {


        let top = null;
        let left = null;
        let bottom = null;
        let right = null;

        let modX = (x - x%WALL_PADLE_WIDTH);
        let modY = (y - y%WALL_PADLE_HEIGHT);

        for(let i = 0; i < wallPadles.length; ++i){

            let padle = wallPadles[i];

            if(padle.life > 0){
                if( modX == padle.x && (modY - WALL_PADLE_HEIGHT) == padle.y ) top = wallPadles[i]; 
                else if( (modX + WALL_PADLE_WIDTH) == padle.x && modY == padle.y ) right = wallPadles[i]; 
                else if( (modX - WALL_PADLE_WIDTH) == padle.x && modY == padle.y ) left = wallPadles[i]; 
                else if( modX == padle.x && (modY) == padle.y ) bottom = wallPadles[i]; 
            }
        }

        if(top == null && left == null && bottom == null && right == null)return -1;

        let motX = (ball.motion.x > 0); // bMx > 0 -> right
        let motY = (ball.motion.y > 0); // bMy > 0 -> down

        let inB = (bottom != null)  ? ( (y + r) >= bottom.y )            : false;
        let inR = (right != null)   ? ( (x + r) >= right.x )             : false;
        let inT = (top != null)     ? ( (y - r) <= (top.y+top.height) )  : false;
        let inL = (left != null)    ? ( (x - r) <= (left.x+left.width) ) : false;

        if(motX == true && motY == true){ //BOTTOM RIGHT

            if(!inB && !inR)return -1;
            else if(inB && !inR){
                bottom.life -= 1;
                return 1;
            }
            else if(!inB && inR){
                right.life -= 1;
                return 2;
            }
            else{
                let distR = ( (x+r) - right.x);
                let distB = ( (y+r) - bottom.y);
                (distR > distB) ? (right.life -= 1) : (bottom.life -= 1);
                return (distR > distB) ? 2 : 1;
            }
        }
        else if(motX && !motY){ //TOP RIGHT

            if(!inT && !inR)return -1;
            else if(inT && !inR){
                top.life -= 1;
                return 1;
            }
            else if(!inT && inR){
                right.life -= 1;
                return 2;
            }
            else{
                let distR = ( (x+r) - right.x);
                let distT = ( (top.y+top.height) - (y-r) );
                (distR > distT) ? (right.life -= 1) : (top.life -= 1);
                return (distR > distT) ? 2 : 1;
            }
        }
        else if(!motX && motY){//BOTTOM LEFT

            if(!inB && !inL)return -1;
            else if(inB && !inL){
                bottom.life -= 1;
                return 1;
            }
            else if(!inB && inL){
                left.life -= 1;
                return 2;
            }
            else{
                let distL = ( (left.x+left.width) - (x-r) );
                let distB = ( (y+r) - bottom.y);
                (distL > distB) ? (left.life -= 1) : (bottom.life -= 1);
                return (distL > distB) ? 2 : 1;
            }
        }
        else if(!motX && !motY){//TOP LEFT

            if(!inT && !inL)return -1;
            else if(inT && !inL){
                top.life -= 1;
                return 1;
            }
            else if(!inT && inL){
                left.life -= 1;
                return 2;
            }
            else{
                let distL = ( (left.x+left.width) - (x-r) );
                let distT = ( (top.y+top.height) - (y-r) );
                (distL > distT) ? (left.life -= 1) : (top.life -= 1);
                return (distL > distT) ? 2 : 1;
            }
        }

        return- 1;
    }

    const nextFrame = () => {

        ball.x += ball.motion.x;
        ball.y += ball.motion.y;

        if( (ball.x + ball.motion.x) < 0 || (ball.x + ball.radius + ball.motion.x) > canvas.width ) ball.motion.x *= -1;

        if( (ball.y + ball.motion.y) > canvas.height ){
            --lives;
            if(lives < 0) resetGame;
            else{
                ball.x = canvas.width/2;
                ball.y = canvas.height*0.75;

                ball.motion.x = 0;
                ball.motion.y = 6;
            }
            //ball.motion.y *= -1;
            //TODO: if lives == 0 => stopGame();
        }

        if( (ball.y + ball.motion.y) < 0 ) ball.motion.y *= -1;

        if( (ball.y + ball.motion.y) > playerPadle.y && ballColidesPadle(ball.x,playerPadle) ){
            playSoundEffect('../resources/sound/endpointHit.flac');
            ball.motion.y *= -1;
            let deltaX = ball.x - (playerPadle.x + playerPadle.width/2);
            ball.motion.x = deltaX * 0.15;
        }

        let r = ballColidesAnyWall(ball.x + ball.motion.x, ball.y + ball.motion.y, ball.radius);
        if(r == -1)console.log(r+ ' \n **********');
        switch( r ){
            case 1: ball.motion.y *= -1; break;
            case 2: ball.motion.x *= -1; break;
        }
    }

    const printPadle = (padle) => {

        canvasContext.fillStyle = padle.color;
        canvasContext.fillRect(padle.x,padle.y,padle.width,padle.height);
    }

    const printWallPadle = (padle) => {

        let dx = ( padle.x + (padle.width/2) ) - ball.x;
        let dy = ( padle.y + (padle.height/2) ) - ball.y;

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
            let padle = wallPadles[i];
            (wallPadles[i].life > 0) ? printWallPadle(wallPadles[i]) : '';
        }
    }

    render();
    nextFrame();
}

const resetGame = () => {

    wallPadles = [];

    let k = 0;
    for(let i = 0; i < 6; i++){
        for(let j = 0; j < (canvas.width / WALL_PADLE_WIDTH); j++){

            let newPadle = { x: 350, y: 200, width: WALL_PADLE_WIDTH, height: WALL_PADLE_HEIGHT,margin: 1, life: 6};
            newPadle.x = ( j * WALL_PADLE_WIDTH);
            newPadle.y = ( (i+1) * WALL_PADLE_HEIGHT );
            newPadle.life =  parseInt(Math.random()*10) % 7;
            wallPadles.push(newPadle);
            ++k;
        }
    }

    ball.x = canvas.width/2;
    ball.y = canvas.height*0.75;

    ball.motion.x = 0;
    ball.motion.y = 6;
}