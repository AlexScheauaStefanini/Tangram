// Functie rotate.
let rotatePieces = (e) => {
	e.preventDefault();

	let possibleRotationArr = ["rotate(0deg)", "rotate(45deg)", "rotate(90deg)", "rotate(135deg)", "rotate(180deg)", "rotate(225deg)", "rotate(270deg)", "rotate(315deg)"]

	if (e.target.closest(".piece")) {
		//verific daca elementul pe care dau clic este paralelogram sau patrat fiindca nu au acelasi nr de rotatii
		if (e.target.closest(".piece").firstElementChild.classList.contains('in-place')) { //nu mai invart elementul dupa ce este in place
			return;
		} else {
			if (e.target.closest(".piece").firstElementChild.id === 'square') {
				possibleRotationArr = ["rotate(0deg)", "rotate(45deg)"];
			} else if (e.target.closest(".piece").firstElementChild.id === 'para') {
				possibleRotationArr = ["rotate(0deg)", "rotate(45deg)", "rotate(90deg)", "rotate(135deg)"];
			}

			let elementRotation = e.target.closest(".piece").style;

			if (possibleRotationArr.indexOf(elementRotation.transform) === possibleRotationArr.length - 1) {
				elementRotation.transform = possibleRotationArr[0];
			} else {
				elementRotation.transform = possibleRotationArr[possibleRotationArr.indexOf(elementRotation.transform) + 1];
			}
			validateMove(e.target.closest(".piece"));
		}
	}
}

if (/Mobi/.test(navigator.userAgent)) { //doubletap for touchscreen
	document.querySelector('.game-container').ondblclick = rotatePieces; //mobile safari doesnt have ondblclick event
} else {
	document.querySelector('.game-container').oncontextmenu = rotatePieces; //right click for mouse
}

let DragElements = {
		pieces: document.querySelectorAll(".piece"),
		manipulatePieces: [],
	
		startDrag:  function(){
		for (let i = 0; i < this.pieces.length; i++) {
				
			let options = {
				onMouseDown: () => {	
					this.pieces[i].style.zIndex = 2
				},
				onMouseUp: () => {
					validateMove(this.pieces[i]);
				},
	
				onTouchMove: () => { this.pieces[i].style.zIndex = 2 },
				onTouchStop: () => {
					validateMove(this.pieces[i]);
				}
			};
			
			this.manipulatePieces.push(window.displacejs(this.pieces[i], options));
		}
	},
	
	 stopDrag: function(){
		for (let i = 0; i < this.manipulatePieces.length; i++) {
			this.manipulatePieces[i].destroy();
		}
	}
}
