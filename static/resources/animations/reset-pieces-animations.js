function resetPieces() {
  let resetPiecesCss = document.styleSheets[4]; //reset-pieces-animations.css / lista in ordinea incarcarii in index
  let pieces = document.querySelectorAll(".piece");
  let stroke = document.querySelector('#stroke');

  for (let i = 0; i < pieces.length; i++) {
    let id = pieces[i].firstElementChild.id;

    resetPiecesCss.addRule(`@keyframes reset-${id}`, `0%{top: ${pieces[i].style.top}; left:${pieces[i].style.left}}; transform:${pieces[i].style.transform}`);
    resetPiecesCss.addRule(`@keyframes reset-${id}`, `100%{top: ${origins[i].top + dragOffsetY}px; left:${(origins[i].left + stroke.offsetLeft + 100)}px; transform:${origins[i].transform}}`);
    pieces[i].classList.add(`reset-${id}`);

    document.querySelector(`.reset-${id}`).addEventListener('animationend', () => {
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