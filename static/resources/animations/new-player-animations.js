function nameAddedAnimation() {
  let tester = new RegExp('[^a-zA-Z0-9]', 'g'); //name validation
  let playerInput = document.querySelector("#player-nickname-input");
  let gameTutorial = document.querySelectorAll(".game-tutorial");

  if (tester.test(playerInput.value) || playerInput.value.length < 3 || playerInput.value.length > 10) {
    playerInput.classList.add('empty-input');
    return;
  } else {
    playerInput.classList.remove('empty-input');
    localStorage.setItem("name", document.querySelector("#player-nickname-input").value);
    createPlayer();
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
      dragElements(); //initializez functia de drag and drop pentru piese
    }, { once: true })
  }
}