const Firebase = require("firebase");
Firebase.initializeApp({
  serviceAccount: 'tangram-fd551-firebase-adminsdk-an96s-2d814e7d84.json',
  databaseURL: 'https://tangram-fd551.firebaseio.com'
})
const db = Firebase.database();

class Database { //class for Firebase interaction
  //get user data from database
  static getUser(name) {
    return db.ref(`users/${name}`).once('value')
      .then(snapshot => snapshot.val());
  };
  //set user data in database
  static async setUser(name, user) {
    db.ref(`users/${name}`).set({
      gamesFinished: user.gamesFinished,
      gamesRemaining: user.gamesRemaining
    },(error) => {
      if (error) {
        return "error";
      }
    })
  };

  //get user level time from database leaderboard
  static getLevelTime(level, player) {
    return db.ref(`leaderboard/${level}/${player}`).once('value')
      .then(snapshot => snapshot.val());
  }

  //set user level time to database leaderboard
  static async setLevelTime(level, player) {
    let currentDbTime = await this.getLevelTime(level, player.name);
    
    if (currentDbTime && currentDbTime > player[player.name] || !currentDbTime) { //if there is already a time in the leaderbpard and the time in the leaderboard is bigger than the current time  
      db.ref(`leaderboard/${level}/${player.name}`).set(player[player.name], (error) => { //or if there isn`t a time in the leaderboard, i update the time
        if (error) {
          return "error";
        }
      })
    }
    return await getPlayerPosition(level, player.name);
  }

  //set user avg time
  static async setAverageTime(obj) {
    let object = {
      avgTime: parseFloat(obj.avgTime),
      name: obj.name
    }

    await db.ref(`avgLeaderboard/${obj.name}`).set(object, (error) => {
      if (error) {
        return "error";
      }
    })

    return obj;
  }

  //get avgLeaderboard 
  static async getAvgLeaderboard() {
    let avgLeaderboard = []
    await db.ref(`avgLeaderboard`).orderByChild('avgTime').once('value')
      .then(snapshot => {
        snapshot.forEach(user => {
          avgLeaderboard.push(user);
        })
      })
      
    return avgLeaderboard;
  }

  //get the first 10 players ordered by their level finishing time
  static async getLevelLeaderboard(level) {
    let lvlLeaderboard = [];
    await db.ref(`leaderboard/${level}`).orderByValue().limitToFirst(10).once('value')
      .then(snapshot => {
        snapshot.forEach(time => {
          lvlLeaderboard.push([time.key, time.val()]);
        })
      });
    return lvlLeaderboard;
  }
  //get all the players that finished a level. called by getPlayerPosition()
  static async getLevelBoard(level) {
    let lvlBoard = [];
    await db.ref(`leaderboard/${level}`).orderByValue().once('value').then(snapshot => {
      snapshot.forEach(time => {
        lvlBoard.push([time.key, time.val()]);
      })
    });
    return lvlBoard;
  }
  //get all the leaderboards
  static async getAllLevelBoards() {
    let levelboards;
    await db.ref('leaderboard').once('value')
      .then(snapshot => {
        levelboards = snapshot;
      })
    return levelboards;
  }
}

async function getPlayerPosition(level, player) { // callback for Database.setLevelTime .returns the position of the player in the leaderboard
  let levelBoard = await Database.getLevelBoard(level);

  for (let i = 0; i < levelBoard.length; i++) {
    if (levelBoard[i].indexOf(player) !== -1) {
      return i + 1;
    }
  }
}

module.exports = Database;