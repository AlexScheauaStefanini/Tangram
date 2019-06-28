const Database = require('./utils/database');
const Data = require('./utils/dataManipulation').Data;
const Timer = require('./utils/dataManipulation').Timer;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.static('static'));
app.use(cors());

let levelTimer;

//
app.get('/api/validate/:userInput', (req, res) => {
  let regEx = new RegExp('[^a-zA-Z0-9]', 'g'); //name validation
  let username = req.params.userInput.trim();

  if (regEx.test(username)) {
    res.status(200).send(false);
  } else {
    res.status(200).send(JSON.stringify(username));
  }
})

//get user from Firebase
app.get('/api/users/:name', async (req, res) => {
  let user = await Database.getUser(req.params.name);
  levelTimer = new Timer();
  if (user) {
    res.status(200).send(JSON.stringify(user));
  } else {
    res.status(200).send(false);
  }
})
//get levelValidationSet
app.get('/api/levelvalidationset/:levelNo', (req, res) => {
  let levelValidationSet = Data.getLevelValidationSet(req.params.levelNo);

  levelTimer.startTimer(); //starts backend Timer - called in main in Api.getlevelvalidationset

  if (levelValidationSet) {
    res.status(200).send(JSON.stringify(levelValidationSet))
  } else {
    res.status(404).send("Could not generate validation set");
  }
})

app.get('/api/levelkeysarray', (req,res) => {
  let levelKeys = Data.getLevelKeysArray();
  if(levelKeys) {
    res.status(200).send(JSON.stringify(levelKeys));
  } else {
    res.status(500).send('Could not get the levels')
  }
})

// post or put user data and AvgTime on Firebase
app.put('/api/users/:name', async (req, res) => {
  let internalTime = levelTimer.stopTimer(); //stops backend timer called in validation in Api.userRequest
  
  req.body.gamesFinished[req.body.gamesFinished.length-1].timeScore = internalTime; //puts backend timer in the data that will be sent to server
  let levelTime = Data.generateLevelTime(req.params.name, req.body, internalTime); //generates levelTime object for level leaderboard
  
  let setUser = await Database.setUser(req.params.name, req.body);
  let setAverageTime = await Database.setAverageTime(Data.setAvgTime(req.params.name, req.body.gamesFinished));
  let playerPositionInLeaderboard = await Database.setLevelTime(levelTime.level, levelTime.levelInfo); //setLevelTime returns player position
  
  if (setUser === "error" || setAverageTime === "error" || playerPositionInLeaderboard === "error") {
    res.status(500).send("User was not saved");
  } else {
    res.status(200).send(JSON.stringify([req.body, setAverageTime, playerPositionInLeaderboard]));
  }
})

// get user level time from leaderboard
app.get('/api/leaderboard/:level/:name', async (req, res) => {
  let response = await Database.getLevelTime(req.params.level, req.params.name);
  if (response) {
    res.status(200).send(JSON.stringify(response));
  } else {
    res.status(404).send("There is no time set")
  }
})

// get first 10 players ordered by completition time.
app.get('/api/leaderboard/:level', async (req, res) => {
  let leaderboard = await Database.getLevelLeaderboard(req.params.level);

  res.status(200).send(JSON.stringify(leaderboard));
})
//get all leaderboards per level
app.get('/api/leaderboard', async (req, res) => {
  let leaderboards = await Database.getAllLevelBoards();
  res.status(200).send(JSON.stringify(leaderboards));
})

//get avg leaderboard
app.get('/api/avgLeaderboard', async (req, res) => {
  let response = await Database.getAvgLeaderboard();
  let playerArray = Data.generateAvgTimeLeaderboard(response);

  if (response === "error") {
    res.status(404).send("Could not get data");
  } else {
    res.status(200).send(JSON.stringify(playerArray));
  }
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening to port: ${port}`));