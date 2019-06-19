function newLevelAnimations() {
  let gameContainer = document.querySelector("#game");
  let stroke = document.querySelector("#stroke");
  let pieces = document.querySelectorAll(".piece");
  let timer = document.querySelector(".timer-container");

  Origins.originsRecalculation();

  gameContainer.classList.add('game-appearing');
  gameContainer.style.opacity = 1;

  timer.classList.add('timer-appearing');
  timer.style.opacity = 1;

  stroke.classList.add('stroke-apearing');
  stroke.style.opacity = 1;

  for (let i = 0; i < pieces.length; i++) {
    //asez piesele in forma initiala
    pieces[i].style.top = (Origins.pieceOriginalCoords[i].top + dragOffsetY) + "px";
    pieces[i].style.left = Origins.pieceOriginalCoords[i].left + "px";


    pieces[i].style.transform = Origins.pieceOriginalCoords[i].transform;
    pieces[i].firstElementChild.classList.remove("in-place");

    if (pieces[i].style.transform === "rotate(90deg)") {
      pieces[i].classList.add('svg-container-appearing-rotated');
    } else {
      pieces[i].classList.add('svg-container-appearing');
    }
    pieces[i].style.opacity = 1;
  }


  document.querySelector("#game").addEventListener('animationend', () => {
    resetOffsets();
    document.querySelector("#game").classList.remove('game-appearing');
    document.querySelector("#stroke").classList.remove('stroke-apearing');
    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i].style.transform === "rotate(90deg)") {
        pieces[i].classList.remove('svg-container-appearing-rotated');
      } else {
        pieces[i].classList.remove('svg-container-appearing');
      }
    }
    timer.classList.remove('timer-appearing');
    resetPieces();
  }, { once: true })
}