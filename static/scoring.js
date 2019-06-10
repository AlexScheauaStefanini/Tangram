class Player {

  constructor(name, gamesRemaining, gamesFinished) {
    this.defaults = {
      remaining: Object.keys(levels),
      finished: []
    }

    this.name = name;
    this.currentLevelValidationSet = {};
    this.gamesRemaining = gamesRemaining || [...this.defaults.remaining]; 
    this.gamesFinished = gamesFinished || [...this.defaults.finished];
  }
  
  setCurrentLevelValidationSet(object){
    this.currentLevelValidationSet = JSON.parse(JSON.stringify(object));
  }

  static levelComplete(currentLevel) {
    let indexOfCurrentLevel = player.gamesRemaining.indexOf(currentLevel);
    let currentLevelTime = levelTimer.stopTimer();
    player.gamesRemaining.splice(indexOfCurrentLevel, 1);
    player.gamesFinished.push({
      level: currentLevel,
      timeScore: currentLevelTime
    })
    return currentLevelTime;
  }

  resetGame() {
    this.gamesRemaining = [...this.defaults.remaining];
    this.gamesFinished = [...this.defaults.finished];
  }

  getAverageTime(){
    let avgTime = 0;
    this.gamesFinished.forEach((levelFinished)=>{
      avgTime += levelFinished.timeScore;
    })
    return parseFloat(avgTime / this.gamesFinished.length);
  }
}

class LevelSelector {

  static newGame() {
    // showAlert(`Hello ${player.name}. New game started`, 'info');
    player.resetGame();
    this.currentLevel = Math.floor(Math.random() * player.gamesRemaining.length);
    return this.currentLevel;
  }

  static nextLevel() {
    for (let i = 0; i < player.gamesFinished.length; i++) {
      if (player.gamesFinished.length !== 0 && currentLevel === player.gamesFinished[i].level || currentLevel === 0) {
        this.currentLevel = Math.floor(Math.random() * player.gamesRemaining.length);
        return this.currentLevel;
      }   
    }
    // showAlert('You have to complete the current level to go to the next one', 'danger');
  }

}

function timer() {
  let interval = 1000;
  let seconds = 0;
  let expected = Date.now() + interval;
  let timeout = '';
  let timerContainer = document.querySelector("#timer")

  function drawTimer(seconds) {
    let minutes = parseInt(seconds / 60);
    let secondsTimer = seconds % 60
    if(secondsTimer < 10){
      timerContainer.innerText = `${minutes}:0${secondsTimer}` //pun 0 in fata secundelor daca am mai putin de 10 secunde
    } else {
      timerContainer.innerText = `${minutes}:${secondsTimer}`
    }
  }

  this.startTimer = function () {
    timeout = setTimeout(step, interval);
    function step() {
      var dt = Date.now() - expected; // the drift (positive for overshooting)
      if (dt > interval) {
        // something really bad happened. Maybe the browser (tab) was inactive?
        // possibly special handling to avoid futile "catch up" run
      }
      seconds++;
      drawTimer(seconds);

      expected += interval;
      timeout = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
    }
  }

  this.stopTimer = function () {
    clearTimeout(timeout);
    return seconds;
  }
}