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
		//align snap coordinates
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
				elmnt.firstElementChild.classList.add("in-place"); // change color and remove events on this element

				if (!Object.keys(player.currentLevelValidationSet).length) { //if the levelvalidationset is empty run validate game
					validateGame();
				}
			}
		}
	}
}

function validateGame() {
	if (!player.gamesRemaining.length) {
		GameFinished.createModal();
	}
	setTimeout(async () => {
		DragElements.stopDrag();
		levelFinishedAnimations();
		player.levelComplete(currentLevel);

		if(!player.gamesRemaining.length){
			document.querySelector('#next-level').style.visibility = 'hidden';
		}

		if (parseInt(currentLevel) !== 1) { //tutorial is skipped from db
			let bestLevelTime = 0;
			let levelPosition = 0;

			let playerObject = {
				"gamesRemaining": player.gamesRemaining,
				"gamesFinished": player.gamesFinished
			}

			await Api.userRequest("post", player.name, playerObject) //add player data in db. (player object)
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


	}, 60)
}
