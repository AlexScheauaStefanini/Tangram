class Api {
 

  static async userRequest(method,player,data) {
    return await fetch(`http://127.0.0.1:3000/api/users/${player}`, {
      method: method,
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    })
    .then(response => response.json())
  }

  static async leaderboardRequest(method,level,player,data) {
    if(!player){
      player = '';
    }
    
    return await fetch(`http://127.0.0.1:3000/api/leaderboard/${level}/${player}`, {
      method: method,
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    })
    .then(response => response.json())
  }
}