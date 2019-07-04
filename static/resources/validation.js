function validateMove(elmnt) {

	let boundaries = 25;

	let elmntId = '';

	if (elmnt.firstElementChild.id === "big-") {
		elmntId = 'big-t';
	} else if (elmnt.firstElementChild.id === "small-") {
		elmntId = 'small-t';
	} else {
		elmntId = elmnt.firstElementChild.id
	}


	let pieceValidationSet = player.currentLevelValidationSet[elmntId];

	for (let i = 0; i < pieceValidationSet.length; i++) {
		//aliniez coordonatele pentru snap cu interfata (pentru resize)
		let elementBoundariesY = pieceValidationSet[i].top + gameOffsetY;
		let elementPositionY = parseInt(elmnt.style.top);
		let elementBoundariesX = pieceValidationSet[i].left + gameOffsetX;
		let elementPositionX = parseInt(elmnt.style.left);

		if (elementBoundariesY + boundaries > elementPositionY && elementBoundariesX + boundaries > elementPositionX) {
			if (elementBoundariesY - boundaries < elementPositionY && elementBoundariesX - boundaries < elementPositionX && elmnt.style.transform === pieceValidationSet[i].transform) {
				setTimeout(() => {
					elmnt.style.top = elementBoundariesY + "px";  // (snap Y)
					elmnt.style.left = elementBoundariesX + "px"; // (snap X)
					inPlacePositions[elmnt.firstElementChild.id] = { top: elementBoundariesY - gameOffsetY, left: elementBoundariesX - gameOffsetX }
				}, 30)

				if (pieceValidationSet.length === 1) {
					delete player.currentLevelValidationSet[elmntId];
				} else {
					pieceValidationSet.splice(i, 1);
				}

				elmnt.style.zIndex = 0;
				elmnt.firstElementChild.classList.add("in-place"); // schimb culoarea si scot eventurile de pe element

				if (!Object.keys(player.currentLevelValidationSet).length) { //if the levelvalidationset is empty run validate game
					validateGame();
				}
			}
		}
	}
}

function validateGame() {
	setTimeout(async () => {
		DragElements.stopDrag();
		player.levelComplete(currentLevel);

		if (parseInt(currentLevel) !== 1) { //nu pun in baza de date primul nivel (tutorialul)
			let bestLevelTime = 0;
			let levelPosition = 0;

			let playerObject = {
				"gamesRemaining": player.gamesRemaining,
				"gamesFinished": player.gamesFinished
			}

			await Api.userRequest("put", player.name, JSON.stringify(playerObject)) //adug datele player`ului in baza de date (nume, jocuri ramase si finalizate)
				.then(data => {
					GameFinished.setAvgTime(data[1].avgTime)
					levelPosition = data[2]
				});

			Api.leaderboardRequest("get", currentLevel, player.name)
				.then((response) => {
					bestLevelTime = response;
				})
				.then(() => {
					if (levelPosition > 10) {
						document.querySelector('.leaderboard.player').innerHTML = `
									<li class="leaderboard-entry d-flex">
										<i class="fas fa-star d-flex align-self-center"></i>
										<div class="w-100 d-flex justify-content-between">
											<p class="leaderboard-text">${levelPosition}</p>
											<p class="leaderboard-text">${player.name}</p>
											<p class="leaderboard-text">${leaderboardSecondsToMinutes(bestLevelTime)}</p>
										</div>
									</li>
								`
					} else {
						getLevelLeaderboard(currentLevel);
					}
				});
		}

		levelFinishedAnimations();
		if (!player.gamesRemaining.length) {
			GameFinished.createModal();
		}
	}, 60)
}
