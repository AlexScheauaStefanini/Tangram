function validateMove(elmnt) {
	let boundaries = 25;
	
	let elmntId = '';

	if(elmnt.firstElementChild.id === "big-"){
		elmntId = 'big-t';
	} else if(elmnt.firstElementChild.id === "small-"){
		elmntId = 'small-t';
	} else {
		elmntId = elmnt.firstElementChild.id
	}
	

	let pieceValidationSet = player.currentLevelValidationSet[elmntId];

	for (let i = 0; i < pieceValidationSet.length; i++) {
		//aliniez coordonatele pentru snap cu interfata (pentru resize)
		let elementBoundariesY = pieceValidationSet[i].top + gameOffsetY;
		let elementPositionY = parseFloat(elmnt.style.top);
		let elementBoundariesX = pieceValidationSet[i].left + gameOffsetX;
		let elementPositionX = parseFloat(elmnt.style.left);
		// console.log(elementPositionY,elementPositionY);



		if (elementBoundariesY + boundaries > elementPositionY && elementBoundariesX + boundaries > elementPositionX) {
			if (elementBoundariesY - boundaries < elementPositionY && elementBoundariesX - boundaries < elementPositionX && elmnt.style.transform === pieceValidationSet[i].transform) {
				setTimeout(() => {
					elmnt.style.top = elementBoundariesY + "px";  // aliniez pozitia elementului cu cea corecta pe axa Y (snap Y)
					elmnt.style.left = elementBoundariesX + "px"; // aliniez pozitia elementului cu cea corecta pe axa X (snap X)
				}, 30)
				// console.log("top:"+elmnt.style.top + " "+ elementBoundariesY);
				// console.log("left:"+elmnt.style.left + " "+ elementBoundariesX);
				if (pieceValidationSet.length === 1) {
					delete player.currentLevelValidationSet[elmntId];
				} else {
					pieceValidationSet.splice(i, 1);
				}
				
				elmnt.style.zIndex = 0;
				elmnt.firstElementChild.classList.add("in-place"); // schimb culoarea si scot eventurile de pe element
			}
		}
	}
}

function validateGame() {

	//verific pozitia elementelor in lista
	let gameWon = Object.keys(player.currentLevelValidationSet).length === 0;
	setTimeout(() => {
		if (gameWon) {
			let currentLevelTime = Player.levelComplete(currentLevel);
			let bestLevelTime = 0;
			let levelPosition = 0;

			let playerObject = {
				"gamesRemaining" : player.gamesRemaining,
				"gamesFinished" : player.gamesFinished
			}
			
			let levelObject = {
				name: `${player.name}`,
				[player.name] : currentLevelTime
			}

			Api.userRequest("put",player.name,JSON.stringify(playerObject)); //adug datele player`ului in baza de date (nume, jocuri ramase si finalizate)
			//request verfic daca timpul actual este mai bun decat timpul din baza de date (daca exista) si inlocuiesc/adaug
			Api.leaderboardRequest("put",currentLevel,'',JSON.stringify(levelObject))
			.then((response)=>{
				levelPosition = response;
				
				Api.leaderboardRequest("get",currentLevel,player.name)
				.then((response)=> {
					bestLevelTime = response;
				})
				.then(()=>{
					// console.log(`your time: ${currentLevelTime} your best time: ${bestLevelTime} your position: ${levelPosition}`)
					if(levelPosition > 10){
						document.querySelector('.leaderboard.player').innerHTML = `
						<li class="leaderboard-entry d-flex">
						<i class="fas fa-star d-flex align-self-center"></i>
						<p class="leaderboard-text">${levelPosition}</p>
						<p class="leaderboard-text">${player.name}</p>
						<p class="leaderboard-text">${leaderboardSecondsToMinutes(bestLevelTime)}</p>
					</li>
						`
					} else {
						getLeaderboard();
					}
				});
			})
			//pun avg time-ul in baza de date
			Api.avgLeaderboardRequest('put',player.name);
			
			// showAlert("Level completed!!! Click next game","success");
			levelFinishedAnimations();
			if(!player.gamesRemaining.length){
				createModalGameFinished();
			}
		}
	}, 60)
}
