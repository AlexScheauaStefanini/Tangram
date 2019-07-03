const getLevels = require('./levels')

let Data = {

  setAvgTime: (player, timesArr) => {
    let totalTime = 0;

    for (let i = 1; i < timesArr.length; i++) { // i = 1 to exclude tutorial from the leaderboards
      totalTime += timesArr[i].timeScore;
    }

    return {
      name: player,
      avgTime: parseFloat((totalTime / (timesArr.length - 1)).toFixed(2)) // -1 to exclude tutorial from the leaderboards
    }
  },

  generateAvgTimeLeaderboard: (object) => {
    let playerArray = [];

    object.forEach(user => {
      playerArray.push([user.val().name, user.val().avgTime]);
    });

    return playerArray;
  },

  getLevelValidationSet: (levelNo) => {
    return getLevels()[levelNo];
  },

  getLevelKeysArray: () => {
    return Object.keys(getLevels());
  },

  generateLevelTime: (name, data, internalTime) => {
    let levelData = data.gamesFinished[data.gamesFinished.length - 1];

    let levelTimeObject = {
      level: parseInt(levelData.level),
      levelInfo: {
        name: name,
        [name]: internalTime,
      }
    };
    return levelTimeObject;
  },

  Timer: function() {
    let startTime;
    let stopTime;
  
    this.startTimer = () => {
      startTime = Date.now();
    }
  
    this.stopTimer = () => {
      stopTime = Date.now();
      return parseInt((stopTime - startTime) / 1000);
    }
  }
}



module.exports = Data;
  