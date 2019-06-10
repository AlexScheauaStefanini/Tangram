function nameAddedAnimation() {
  if (!document.querySelector("#player-nickname-input").value) {
    document.querySelector("#player-nickname-input").classList.add('empty-input');
    return;
  } else {
    document.querySelector("#player-nickname-input").classList.remove('empty-input');
    createPlayer();
  }

  document.querySelector(".player-input-container").classList.add('player-input-container-name-added');
  document.querySelector(".player-input-info").classList.add("player-input-info-remove");
  document.querySelector("#player-nickname-input").style.pointerEvents = "none";
  document.querySelectorAll(".game-tutorial").forEach(text => {
    text.classList.add("game-tutorial-show");
  })
  
  document.querySelector(".btn-play").classList.add('removeTrue')
  
}

function removeCharacterInterface(game) {
  if (document.querySelector(".btn-play").classList.contains('removeTrue')) {
    document.querySelector(".removable-container").classList.add('remove-new-player-interface');

    document.querySelector(".removable-container").addEventListener('animationend', () => {
      document.querySelector(".removable-container").remove(); //sterg containerul in care adaug player nou
      document.querySelector(".nav").classList.add("navbar-appear");
      
      gameInitialize(game)
      dragElements(); //initializez functia de drag and drop pentru piese
    }, { once: true })
  }
}