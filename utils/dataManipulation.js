const levels = require('./levels')

class Data {

  static setAvgTime(player, timesArr) {
    let totalTime = 0;

    for (let i = 1; i < timesArr.length; i++) { // i = 1 pentru a nu include si tutorialul in calcul
      totalTime += timesArr[i].timeScore;
    }

    return {
      name: player,
      avgTime: parseFloat((totalTime / (timesArr.length - 1)).toFixed(2)) // -1 pentru a nu include si tutorialul in calcul
    }
  }

  static generateAvgTimeLeaderboard(object) {
    let playerArray = [];

    object.forEach(user => {
      playerArray.push([user.val().name, user.val().avgTime]);
    });

    return playerArray;
  }

  static getLevelValidationSet(levelNo) {
    return levels()[levelNo];
  }

  static getLevelKeysArray(){
    return Object.keys(levels());
  }
}

module.exports = Data;