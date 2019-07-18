let dragOffsetY = document.querySelector("#drag-container").offsetTop;
let dragOffsetX = document.querySelector("#drag-container").offsetLeft;
let gameOffsetX = document.querySelector("#game").offsetLeft;
let gameOffsetY = document.querySelector("#game").offsetTop;

let currentLevel = 0;
let player = '';

function getPlayerNameFromLocal() { //check if player name is saved in localstorage
	if (localStorage.name) {
		document.querySelector('#player-nickname-input').value = localStorage.name;
	}
}

document.addEventListener('keypress', function (e) { //enter key listener for play btn
	if (e.key === "Enter" && document.querySelector(".btn-play")) {
		document.querySelector(".btn-play").click();
	}
})

async function createPlayer() {
	let playBtn = document.querySelector(".btn-play");
	let playerInput = document.querySelector("#player-nickname-input");
	let apiUsername = '';
	playBtn.setAttribute("onclick", ''); //playbtn onclick none to not run create player multiple times

	await fetch(`./api/validate/${playerInput.value}`) //player name validation on backend
		.then(response => response.json())
		.catch(err => {
			playBtn.setAttribute("onclick", 'createPlayer()');
			playerInput.classList.add('empty-input')
		})
		.then(response => apiUsername = response);

	if (!apiUsername) {
		playBtn.setAttribute("onclick", 'createPlayer()');
		return playerInput.classList.add('empty-input');
	}

	playerInput.classList.remove('empty-input');
	nameAddedAnimation();

	//try to create player with data from db, else create new player
	await Api.userRequest("get", apiUsername)
		.then(response => {
			if (response) {
				player = new Player(apiUsername, response.gamesRemaining || [], response.gamesFinished);
				if (player.gamesRemaining.length === 0) {
					playBtn.setAttribute("onclick", 'removeCharacterInterface("new")');
				} else {					
					player.updateLevels(); //function that makes sure the user has all the levels available
					playBtn.setAttribute("onclick", 'removeCharacterInterface("next")');
				}
			} else {
				player = new Player(apiUsername);
				playBtn.setAttribute("onclick", 'removeCharacterInterface("new")');
			}
		})
	localStorage.setItem("name", apiUsername);
}

let levelTimer = '';
function gameInitialize(game) {
	if (levelTimer) {
		levelTimer.stopTimer(); //stop timer if exists
	}
	DragElements.stopDrag();

	// if(typeof game === "number"){
	// 	currentLevel = game;
	// } else

	if (game === "new") {
		player = new Player(player.name);
		levelTimer = new timer();
		currentLevel = "1"; //reset player progress
		levelTimer.startTimer();

	} else if (game === "next") {
		currentLevel = player.gamesRemaining[LevelSelector.nextLevel()];
		levelTimer = new timer();
		levelTimer.startTimer();
	}

	try {devOnly()} catch (error) {} //prints internal level number on screen

	Api.getLevelValidationSet(currentLevel)
		.then(data => player.setCurrentLevelValidationSet(data)); //initialize player.currentlevelvalidation set with data from backend

	document.querySelector('.leaderboard.player').innerHTML = ''; 

	document.querySelector('.btn-name').innerText = player.name;
	if (player.gamesFinished.length === 0) {
		document.querySelector('.btn-level').innerText = "Tutorial";
	} else {
		document.querySelector('.btn-level').innerHTML = `Puzzle <span>${player.gamesFinished.length}</span>`;
	}

	try { //ResizeObserver will resize the dragContainer with the width of the level container. Centers the stroke in the game
		new ResizeObserver(() => document.querySelector('#drag-container').style.width = document.querySelector('#game').clientWidth + 'px').observe(document.querySelector('#game'));
	}
	catch (err) {
		document.querySelector('#drag-container').style.width = 600 + 'px';
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
	dragOffsetX = document.querySelector("#drag-container").offsetLeft;
	gameOffsetX = document.querySelector("#game").offsetLeft;
	gameOffsetY = document.querySelector("#game").offsetTop;
}

let windowWidth = window.innerWidth;
window.onresize = () => {
	if (this.innerWidth === windowWidth) { //reset pieces and offsets if resize is on width
		return;
	}
	windowWidth = this.innerWidth;

	resetOffsets();
	resetPieces();
}

