function nameAddedAnimation() {
  
  let playerInput = document.querySelector("#player-nickname-input");
  let gameTutorial = document.querySelectorAll(".game-tutorial");

  if ( navigator.userAgent.indexOf("Edge") > -1 && navigator.appVersion.indexOf('Edge') > -1 ) { //repairs bug from edge related to gradients
    document.styleSheets[1].insertRule(`#level * { fill: rgb(81, 141, 178); stroke: rgb(81, 141, 178); }`,document.styleSheets[1].cssRules.length);
  }

  document.querySelector(".player-input-container").classList.add('player-input-container-name-added');
  document.querySelector(".player-input-info").classList.add("player-input-info-remove");
  playerInput.style.pointerEvents = "none";
  for (let i = 0; i < gameTutorial.length; i++) {
    gameTutorial[i].classList.add("game-tutorial-show");
  }
  document.querySelector(".btn-play").classList.add('removeTrue');  
}

function removeCharacterInterface(game) {

  if (document.querySelector(".btn-play").classList.contains('removeTrue')) {
    document.querySelector(".removable-container").classList.add('remove-new-player-interface');
    document.querySelector(".title-container a").style.display = "inline";
    document.querySelector(".removable-container").addEventListener('animationend', () => {
      document.querySelector(".removable-container").remove(); //sterg containerul in care adaug player nou
      document.querySelector(".nav").classList.add("navbar-appear"); //salvez username`ul in localStorage. va fi autocompletat cand redeschid pagina

      gameInitialize(game)
    }, { once: true })
  }
}