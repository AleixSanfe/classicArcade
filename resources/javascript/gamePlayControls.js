let gameInterval = null;
let previewInterval = null;

let isGameRuning = false;
let isNewGame = true;

let audioElement = null;
var playSoundEffect = (path) => {
	audioElement = document.createElement('audio');
	audioElement.setAttribute('src', path);
	audioElement.play();
}

var initializeEvents = (canvas,game,resetFunction,previewFunction,mouseCallback) => {

	canvas.addEventListener('mousemove',(event) => mouseCallback(event) );

    window.addEventListener('keypress',(event) => {
        if(event.keyCode == 32){

        	if(!isGameRuning){

        		isGameRuning = true;

        		if(isNewGame){
        			isNewGame = false;
        			clearInterval(previewInterval);
        			resetFunction();
        		}
        		gameInterval = setInterval(game,1000 / framesPerSecond);

        	}else{
        		clearInterval(gameInterval);
        		isGameRuning = false;
        	}
        }
    });

    previewInterval = setInterval(previewFunction,1000 / 3);
	
}

var calculateMousePos = (event) => {
	let canvasBCR = canvas.getBoundingClientRect();
	let documentRoot = document.documentElement;
	return {
		x: event.clientX - canvasBCR.left - documentRoot.scrollLeft,
		y: event.clientY - canvasBCR.top - documentRoot.scrollTop
	}
}