function resetPieces() {
  let resetPiecesCss = document.styleSheets[4]; //reset-pieces-animations.css / lista in ordinea incarcarii in index
  let pieces = document.querySelectorAll(".piece");
  let stroke = document.querySelector('#stroke');
  let resetButton = document.querySelector('.reset-button')

  resetButton.setAttribute('onclick',''); //scot functia de resetPieces de pe buton atata timp cat animatia este in desfasurare
  for (let i = 0; i < pieces.length; i++) {
    let id = pieces[i].firstElementChild.id;
    resetPiecesCss.insertRule(`@keyframes reset-${id}{
      0%{
        top: ${pieces[i].style.top}; 
        left:${pieces[i].style.left}; 
        transform:${pieces[i].style.transform};
      }
      100%{
        top: ${origins[i].top + dragOffsetY}px; 
        left:${(origins[i].left + stroke.offsetLeft + 100)}px; 
        transform:${origins[i].transform};
      }
    }`, resetPiecesCss.cssRules.length)

    pieces[i].classList.add(`reset-${id}`);

    document.querySelector(`.reset-${id}`).addEventListener('animationend', () => {

      resetButton.setAttribute('onclick','resetPieces();');//pun functia de resetPieces de pe buton atata timp cat animatia este in desfasurare
      // piesele raman pe locul unde ajung dupa animatie
      pieces[i].style.top = (origins[i].top + dragOffsetY) + "px";
      pieces[i].style.left = (origins[i].left + stroke.offsetLeft + 100) + "px";
      pieces[i].style.transform = origins[i].transform;

      pieces[i].classList.remove(`reset-${id}`);
      pieces[i].firstElementChild.classList.remove("in-place"); //deblochez draganddrop de pe elemente dupa ce animatia se termina

      if (Object.keys(resetPiecesCss.cssRules)[7]) { //sunt mai mult de 7 evenimente de animation end... for some reason
        //in reset-pieces-animations.css sunt 6 reguli create deja. vreau sa le sterg pe cele noi cand se termina animatia. la fiecare iteratie sterg elementul 7
        resetPiecesCss.deleteRule(7);
      }
    })
  }
  resetOffsets(); //recalibrez coordonatele unde trebuie sa ajung piesele
  player.setCurrentLevelValidationSet(levels[currentLevel]); //reinitializez obiectul cu coordonatele care vor vailda nivelul actual
}