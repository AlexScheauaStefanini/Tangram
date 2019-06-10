
// // Functie rotate.

let rotatePieces = (e) => {
	e.preventDefault(); // prevent rightclick menu

	let possibleRotationArr = ["rotate(0deg)","rotate(45deg)","rotate(90deg)","rotate(135deg)","rotate(180deg)","rotate(225deg)","rotate(270deg)","rotate(315deg)"]
	
	if(e.target.closest(".piece")){
		//verific daca elementul pe care dau clic este paralelogram sau patrat fiindca nu au acelasi nr de rotatii
		if(e.target.closest(".piece").firstElementChild.classList.contains('in-place')){ //nu mai invart elementul dupa ce este in place
			return;
		} else {
			if(e.target.closest(".piece").firstElementChild.id === 'square'){
				possibleRotationArr = ["rotate(0deg)","rotate(45deg)"];
			} else if(e.target.closest(".piece").firstElementChild.id === 'para'){
				possibleRotationArr = ["rotate(0deg)","rotate(45deg)","rotate(90deg)","rotate(135deg)"];
			}
	
			let elementRotation = e.target.closest(".piece").style;
			
			if(possibleRotationArr.indexOf(elementRotation.transform) === possibleRotationArr.length - 1) {
				elementRotation.transform = possibleRotationArr[0];
			} else {
				elementRotation.transform = possibleRotationArr[possibleRotationArr.indexOf(elementRotation.transform) + 1];
			}
	
		}
	}
}

document.oncontextmenu = rotatePieces;
document.ondblclick = rotatePieces;

function closeDrag(elmnt) {	
	validateMove(elmnt);
	validateGame();
}

function dragElements(){
	let pieces = document.querySelectorAll(".piece");
	pieces.forEach(piece => {
		let options = {
			onMouseDown: ()=>{piece.style.zIndex = 2},
			onMouseUp: ()=>{
				closeDrag(piece);   																													//to uncomment
				// positionGenerator();	
			},
			onTouchMove: ()=>{piece.style.zIndex = 2},
			onTouchStop: ()=>{
				closeDrag(piece);
			}
		};

		window.displacejs(piece,options);
	});
}
