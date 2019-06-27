let defaultsRemainingKeys = []; 
(() => { //get levels array for this.defaults.remaining
  Api.getLevelKeysArr()
   .then(data => defaultsRemainingKeys = data)
})()

class Player {

  constructor(name, gamesRemaining, gamesFinished) {
    this.defaults = {
      remaining: defaultsRemainingKeys,
      finished: []
    }

    this.name = name;
    this.currentLevelValidationSet = {};
    this.gamesRemaining = gamesRemaining || [...this.defaults.remaining];
    this.gamesFinished = gamesFinished || [...this.defaults.finished];
  }

  setCurrentLevelValidationSet(object) {
    this.currentLevelValidationSet = JSON.parse(JSON.stringify(object));
  }

  levelComplete(currentLevel) {
    let indexOfCurrentLevel = this.gamesRemaining.indexOf(currentLevel);
    let currentLevelTime = levelTimer.stopTimer();
    this.gamesRemaining.splice(indexOfCurrentLevel, 1);
    this.gamesFinished.push({
      level: currentLevel,
      timeScore: currentLevelTime
    })
    return currentLevelTime;
  }

  resetGame() {
    this.gamesRemaining = [...this.defaults.remaining];
    this.gamesFinished = [...this.defaults.finished];
  }
}

let LevelSelector = {
  newGame: function () {
    player.resetGame();
    this.currentLevel = Math.floor(Math.random() * player.gamesRemaining.length);
    return this.currentLevel;
  },

  nextLevel: function () {
    for (let i = 0; i < player.gamesFinished.length; i++) {
      if (player.gamesFinished.length !== 0 && currentLevel === player.gamesFinished[i].level || currentLevel === 0) {
        this.currentLevel = Math.floor(Math.random() * player.gamesRemaining.length);
        return this.currentLevel;
      }
    }
  },
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
    if (secondsTimer < 10) {
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