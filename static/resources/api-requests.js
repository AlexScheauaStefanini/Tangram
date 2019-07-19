class Api {
  static async userRequest(method, player, data) {
    return await fetch(`/api/users/${player}`, {
      method: method,
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    })
      .then(response => response.json())
  }

  static async leaderboardRequest(method, level, player, data) {
    if (!player) {
      player = '';
    }
    
    return await fetch(`/api/leaderboard/${level}/${player}`, {
      method: method,
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    })
      .then(response => response.json())
  }

  static async avgLeaderboardRequest() {
    return await fetch(`/api/avgLeaderboard/`)
      .then(response => response.json())
  }

  static async getLevelValidationSet(levelNo){
    return await fetch(`/api/levelvalidationset/${levelNo}`)
    .then(response => response.json())
  }

  static getLevelKeysArr(){
    return fetch('/api/levelkeysarray')
    .then(response => response.json())
  }
}