//https://vectr.com/ascheaua/bFSFoU14Y
let dragOffsetY = document.querySelector("#drag-container").offsetTop;
let gameOffsetX = document.querySelector("#game").offsetLeft;
let gameOffsetY = document.querySelector("#game").offsetTop;

let currentLevel = 0;
let player = '';

function getPlayerNameFromLocal() { //verific daca am nume salvat in localstorage dintr-o sesiune trecuta
	if (localStorage.name) {
		document.querySelector('#player-nickname-input').value = localStorage.name;
	}
}

document.addEventListener('keypress', function (e) { //listener de enter Key pentru butonul de play
	if (e.key === "Enter" && document.querySelector(".btn-play")) {
		document.querySelector(".btn-play").click();
	}
})

async function createPlayer() {
	let playBtn = document.querySelector(".btn-play");
	let playerInput = document.querySelector("#player-nickname-input");
	let apiUsername = '';

	await fetch(`./api/validate/${playerInput.value}`) //trimit player input la server pentru validare
		.then(response => response.json())
		.catch(err => playerInput.classList.add('empty-input'))
		.then(response => apiUsername = response);

	if (!apiUsername) {
		return playerInput.classList.add('empty-input');
	}

	playerInput.classList.remove('empty-input');
	nameAddedAnimation();

	playBtn.setAttribute("onclick", ''); //scot functia createPlayer() de pe buton pentru a nu rula functia createPLayer de mai multe ori

	//incerc sa creez user dupa datele din baza de date. daca nu pot creez player nou
	await Api.userRequest("get", apiUsername)
		.then(response => {
			if (response) {
				player = new Player(apiUsername, response.gamesRemaining || [], response.gamesFinished);
				if (player.gamesRemaining.length === 0) {
					playBtn.setAttribute("onclick", 'removeCharacterInterface("new")');
				} else {
					playBtn.setAttribute("onclick", 'removeCharacterInterface("next")');
				}
			} else {
				console.log('New Player');
				
				player = new Player(apiUsername);
				playBtn.setAttribute("onclick", 'removeCharacterInterface("new")');
			}
		})
		localStorage.setItem("name", apiUsername);
}

let levelTimer = '';
function gameInitialize(game) {
	if (levelTimer) {
		levelTimer.stopTimer(); //opresc cronometrul existent daca exista
	}

	// if(typeof game === "number"){
	// 	currentLevel = game;
	// } else

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
	//to uncomment
	player.setCurrentLevelValidationSet(levels[currentLevel]); //initializez currentLevelValidation set al obiectului player cu coordonatele care vor vailda nivelul actual
	document.querySelector('.leaderboard.player').innerHTML = ''; // sterg ultimul rand din leaderboard

	document.querySelector('.btn-name').innerText = player.name;
	if (player.gamesFinished.length === 0) {
		document.querySelector('.btn-level').innerText = "Tutorial";
	} else {
		document.querySelector('.btn-level').innerText = "Puzzle " + (player.gamesFinished.length);
	}

	try {
		new ResizeObserver(() => document.querySelector('#drag-container').style.width = document.querySelector('#game').clientWidth + 'px').observe(document.querySelector('#game'));
	}
	catch (err) {
		document.querySelector('#drag-container').style.width = 600+'px';
		console.log("ResizeObserver not available");
	}

	document.querySelector('#game').innerHTML = `<img src="./resources/levels/level${currentLevel}.svg" id="level" onload="SVGInject(this)"></img>`

	resetOffsets();
	newLevelAnimations();
	getLevelLeaderboard(currentLevel);
	DragElements.startDrag();
}

function resetOffsets() {
	dragOffsetY = document.querySelector("#drag-container").offsetTop;
	gameOffsetX = document.querySelector("#game").offsetLeft;
	gameOffsetY = document.querySelector("#game").offsetTop;
}

let windowWidth = window.innerWidth;
window.onresize = () => { 	
	if(this.innerWidth === windowWidth){ //resetez piesele si offsetul doar daca resizeul este pe width, si nu pe height
		return;
	}
	windowWidth = this.innerWidth;

	resetOffsets();
	resetPieces();
}