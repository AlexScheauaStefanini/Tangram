const Database = require('./utils/database');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.static('static'));
app.use(cors());


//
app.get('/api/validate/:userInput', (req,res) => {
  let regEx = new RegExp('[^a-zA-Z0-9]', 'g'); //name validation
  let username = req.params.userInput.trim();
  
  if(regEx.test(username)){
    res.status(200).send(false);
  } else {
    res.status(200).send(JSON.stringify(username));
  }
})

//get user from Firebase
app.get('/api/users/:name', async (req, res) => {
  let user = await Database.getUser(req.params.name);
  if (user) {
    res.status(200).send(JSON.stringify(user));
  } else {
    res.status(200).send(false);
  }
})

// post or put user on Firebase
app.put('/api/users/:name', async (req, res) => {
  let response = await Database.setUser(req.params.name, req.body);
  if (response === "error") {
    res.status(500).send("User was not saved");
  } else {
    res.status(200).send(JSON.stringify(req.body));
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

// post or put user level timescore to leaderboard
app.put('/api/leaderboard/:level', async (req, res) => {
  let response = await Database.setLevelTime(req.params.level, req.body);
  
  if (response === "error") {
    res.status(500).send("Time was not saved");
  } else {
    res.status(200).send(JSON.stringify(response));
  }
})

//post or put player avg time
app.put('/api/avgLeaderboard/:name', async (req, res) => {
  let response = await Database.setAverageTime(req.body);
  
  if (response === "error") {
    res.status(500).send("Time was not saved");
  } else {
    res.status(200).send(JSON.stringify(response));
  }
})

//get general avg leaderboard
app.get('/api/avgLeaderboard', async (req, res)=>{
  let response = await Database.getAvgLeaderboard();
  let playerArray = [];

  response.forEach(user => {
    playerArray.push([user.val().name,user.val().avgTime]); 
  });
  
  if (response === "error") {
    res.status(404).send("Could not get data");
  } else {
    res.status(200).send(JSON.stringify(playerArray));
  }
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port: ${port}`));