function resetPieces(click) {
  let resetPiecesCss = document.styleSheets[4]; //reset-pieces-animations.css / lista in ordinea incarcarii in index
  let pieces = document.querySelectorAll(".piece");
  let resetButton = document.querySelector('.reset-button')

  Origins.originsRecalculation();
  if(click){
    player.setCurrentLevelValidationSet(); //initializez currentLevelValidation set al obiectului player cu coordonatele care vor vailda nivelul actual
  }

  resetButton.setAttribute('onclick', ''); //scot functia de resetPieces de pe buton atata timp cat animatia este in desfasurare
  for (let i = 0; i < pieces.length; i++) {
    let id = pieces[i].firstElementChild.id;
    if (click) { //if the function was called from resetButton
      pieces[i].firstElementChild.classList.remove("in-place"); //deblochez draganddrop de pe elemente
      resetPiecesCss.insertRule(`@keyframes reset-${id}{
        0%{
          top: ${pieces[i].style.top}; 
          left:${pieces[i].style.left};  
          transform:${pieces[i].style.transform};
        }
        100%{
          top: ${Origins.pieceOriginalCoords[i].top + dragOffsetY}px; 
          left:${Origins.pieceOriginalCoords[i].left}px;
          transform:${Origins.pieceOriginalCoords[i].transform};
        }
      }
      `, resetPiecesCss.cssRules.length)
    } else {
      if (pieces[i].firstElementChild.classList.contains('in-place')) {
        resetPiecesCss.insertRule(`@keyframes reset-${id}{
          0%{
            top: ${pieces[i].style.top}; 
            left:${pieces[i].style.left};  
          }
          100%{
            top: ${inPlacePositions[id].top + gameOffsetY}px; 
            left:${inPlacePositions[id].left + gameOffsetX}px;
          }
        }
        `, resetPiecesCss.cssRules.length)
      } else {
        resetPiecesCss.insertRule(`@keyframes reset-${id}{
          0%{
            top: ${pieces[i].style.top}; 
            left:${pieces[i].style.left};  
            transform:${pieces[i].style.transform};
          }
          100%{
            top: ${Origins.pieceOriginalCoords[i].top + dragOffsetY}px; 
            left:${Origins.pieceOriginalCoords[i].left}px;
            transform:${Origins.pieceOriginalCoords[i].transform};
          }
        }
        `, resetPiecesCss.cssRules.length)
      }
    }

    pieces[i].classList.add(`reset-${id}`);

    document.querySelector(`.reset-${id}`).addEventListener('animationend', () => {
      resetButton.setAttribute('onclick', 'resetPieces(true);');//pun functia de resetPieces de pe buton la sfarsitul animatiei

      // piesele raman pe locul unde ajung dupa animatie
      if (pieces[i].firstElementChild.classList.contains('in-place')) {
        pieces[i].style.top = inPlacePositions[id].top + gameOffsetY + 'px';
        pieces[i].style.left = inPlacePositions[id].left + gameOffsetX + 'px';
      } else {
        pieces[i].style.top = Origins.pieceOriginalCoords[i].top + dragOffsetY + "px";
        pieces[i].style.left = Origins.pieceOriginalCoords[i].left + "px";
        pieces[i].style.transform = Origins.pieceOriginalCoords[i].transform;
      }
      pieces[i].classList.remove(`reset-${id}`);

      if (Object.keys(resetPiecesCss.cssRules)[7]) { //sunt mai mult de 7 evenimente de animation end... for some reason
        //in reset-pieces-animations.css sunt 6 reguli create deja. vreau sa le sterg pe cele noi cand se termina animatia. la fiecare iteratie sterg elementul 7
        resetPiecesCss.deleteRule(7);
      }
    })
  }
  resetOffsets(); //recalibrez coordonatele unde trebuie sa ajung piesele
}

let inPlacePositions = { //used for recalibrating in-place pieces on the level, generated in pieceValidation in validation.
  ['big-t']: {},
  ['big-']: {},
  ['medT']: {},
  ['para']: {},
  ['smallT1']: {},
  ['smallT2']: {}
}