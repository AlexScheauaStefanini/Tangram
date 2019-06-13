function levelFinishedAnimations() {
  let levelFinishedCss = document.styleSheets[5];

  let levelSvg = document.querySelector("#game");
  let dragContainer = document.querySelector("#drag-container");
  let nextLevelButton = document.querySelector("#next-level");
  let stroke = document.querySelector("#stroke");
  let timer = document.querySelector(".timer-container")

  let windowCenter = window.innerWidth / 2 - document.querySelector('#game').offsetLeft - document.querySelector('#game').offsetWidth / 2;


  levelFinishedCss.insertRule(`@keyframes game-level-finished{
    0%{transform: translateX(0);}
    100%{transform: translateX(calc(${windowCenter}px));}
  }`, levelFinishedCss.cssRules.length)

  dragContainer.classList.add("drag-container-level-finished");

  dragContainer.addEventListener('animationend', () => {
    levelSvg.classList.add("game-level-finished");
    levelSvg.classList.add("game-level-finished-fill");
    nextLevelButton.classList.add("next-button-level-finished");
    stroke.classList.add("stroke-level-finished");
    timer.classList.add("timer-level-finished");
  }, { once: true })

  levelSvg.addEventListener('animationend', () => {
    stroke.style.opacity = 0;
    nextLevelButton.setAttribute('onclick', "gameInitialize('next');removeLevelFinishedAnimations();");
    levelSvg.classList.remove("game-level-finished");
    levelSvg.style.transform = `translateX(calc(${windowCenter}px))`;
  }, { once: true })

}

//sterg clasele de animatie pentru finalizarea nivelului cand incep joc nou.
function removeLevelFinishedAnimations() {

  let levelSvg = document.querySelector("#game");
  let dragContainer = document.querySelector("#drag-container");
  let nextLevelButton = document.querySelector("#next-level");
  let stroke = document.querySelector("#stroke");
  let timer = document.querySelector(".timer-container")

  levelSvg.classList.remove("game-level-finished-fill");
  dragContainer.classList.remove("drag-container-level-finished");
  nextLevelButton.classList.remove("next-button-level-finished");
  stroke.classList.remove("stroke-level-finished");
  timer.classList.remove("timer-level-finished");
  levelSvg.style.transform = `translateX(0px)`;
  nextLevelButton.removeAttribute('onclick');

  let levelFinishedCss = document.styleSheets[5];
  if (levelFinishedCss.cssRules.length > 10) {
    levelFinishedCss.deleteRule(levelFinishedCss.cssRules.length - 1)
  }
}