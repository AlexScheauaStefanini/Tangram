//https://vectr.com/ascheaua/bFSFoU14Y
let gameOffsetX = document.querySelector("#game").offsetLeft;
let gameOffsetY = document.querySelector("#game").offsetTop;

let dragOffsetX = document.querySelector("#drag-container").offsetLeft;
let dragOffsetY = document.querySelector("#drag-container").offsetTop;


window.onresize = () => {
	resetOffsets();
}


let currentLevel = 0;
let player = '';

async function createPlayer() {
	let playBtn = document.querySelector(".btn-play");
	let nicknameInput = document.querySelector("#player-nickname-input");

	playBtn.setAttribute("onclick",''); //scot functia nameAddedAnimation() de pe buton pentru a nu rula functia createPLayer de mai multe ori

	await Api.userRequest("get",nicknameInput.value)
	.catch(() => {
		player = new Player(nicknameInput.value);
		playBtn.setAttribute("onclick",'removeCharacterInterface("new")');
	})
	.then(response => {
		player = new Player(nicknameInput.value, response.gamesRemaining || [], response.gamesFinished);
		playBtn.setAttribute("onclick",'removeCharacterInterface("next")');
	})
	
}


let levelTimer = '';
function gameInitialize(game) {
	if(levelTimer){
		levelTimer.stopTimer(); //opresc cronometrul existent
	}
	
	if (game === "new") {
		player = new Player(player.name);
		levelTimer = new timer();
		currentLevel = "1"; //resetez progresul utilizatorului si incep cu tutorialul
		levelTimer.startTimer();
		
	} else if (!(player.gamesRemaining[LevelSelector.nextLevel()])) {
		return; //daca incerc sa trec la nivelul urmator fara sa termin nivelul curent ies din functie
	} else if (game === "next") {
		currentLevel = player.gamesRemaining[LevelSelector.nextLevel()];
		levelTimer = new timer();
		levelTimer.startTimer();
	}

	player.setCurrentLevelValidationSet(levels[currentLevel]); //initializez currentLevelValidation set al obiectului player cu coordonatele care vor vailda nivelul actual
	
	document.querySelector('.btn-name').innerText = player.name;
	if(player.gamesFinished.length === 0){
		document.querySelector('.btn-level').innerText = "Tutorial";
	} else {
		document.querySelector('.btn-level').innerText = "Puzzle " + currentLevel; //(player.gamesFinished.length); currentLevel
	}

	new ResizeObserver(() => document.querySelector('#drag-container').style.width = document.querySelector('#game').clientWidth +'px').observe( document.querySelector('#game'));
	document.querySelector('#game').innerHTML = `<img src="./resources/levels/level${currentLevel}.svg" id="level" onload="SVGInject(this)"></img>`
	
	resetOffsets();
	newLevelAnimations();
}

function resetOffsets(){
	dragOffsetX = document.querySelector("#drag-container").offsetLeft;
	dragOffsetY = document.querySelector("#drag-container").offsetTop;

	gameOffsetX = document.querySelector("#game").offsetLeft;
	gameOffsetY = document.querySelector("#game").offsetTop;
}






