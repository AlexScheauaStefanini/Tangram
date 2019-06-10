const Database = require('./src/database');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.static('static'));
app.use(cors());

//get user from Firebase
app.get('/api/users/:name', async (req, res) => {
  let user = await Database.getUser(req.params.name);
  if(user){
    res.status(200).send(JSON.stringify(user));
  } else {
    res.status(404).send("404: User not found");
  }
})

// post or put user on Firebase
app.put('/api/users/:name', async (req,res) => {
  let response = await Database.setUser(req.params.name, req.body);
  if(response === "error"){
    res.status(500).send("User was not saved");
  } else {
    res.status(200).send(JSON.stringify(req.body));
  }
})

// get user level time from leaderboard
app.get('/api/leaderboard/:level/:name', async (req, res) => {
  let response = await Database.getLevelTime(req.params.level, req.params.name);
  if(response){
    res.status(200).send(JSON.stringify(response));
  } else {
    res.status(404).send("There is no time set")
  }
})

// get first 10 players ordered by completition time.
app.get('/api/leaderboard/:level', async (req,res) => {
  let leaderboard = await Database.getLevelLeaderboard(req.params.level);
  res.status(200).send(JSON.stringify(leaderboard));
})

// post or put user level timescore to leaderboard
app.put('/api/leaderboard/:level', async (req,res) => {
  let response = await Database.setLevelTime(req.params.level, req.body);
  if(response === "error"){
    res.status(500).send("Time was not saved");
  } else {
    res.status(200).send(JSON.stringify(response));
  }
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port: ${port}`));