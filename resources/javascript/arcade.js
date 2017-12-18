
let arcadeTitle = null;
const FREQUENCY = 255;
let red = 255;
let green = 0;
let blue = 0;
let stage = 1;

function updateColor(){

	switch(stage){
		case 1:
			++green;
			(green == 255) ? (stage = 2) : '';
			break;
		case 2:
			--red;
			(red == 0) ? (stage = 3) : '';
			break;
		case 3:
			++blue;
			(blue == 255) ? (stage = 4) : '';
			break;
		case 4:
			--green;
			(green == 0) ? (stage = 5) : '';
			break;
		case 5:
			++red;
			(red == 255) ? (stage = 6) : '';
			break;
		case 6:
			--blue;
			(blue == 0) ? (stage = 1) : '';
			break;
	}

	arcadeTitle.style.color = 'rgb('+red+','+green+','+blue+')';

}

window.onload = function(){

	arcadeTitle = document.getElementById('arcadeTitle');

	setInterval(updateColor,1000 / FREQUENCY);
}