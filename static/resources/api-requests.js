class Api {
  static async userRequest(method, player, data) {
    return await fetch(`./api/users/${player}`, {
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

    return await fetch(`./api/leaderboard/${level}/${player}`, {
      method: method,
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    })
      .then(response => response.json())
  }

  static async avgLeaderboardRequest(method, playerName) {
    let data = '';
    if (playerName) {
      data = {
        name: player.name,
        avgTime: player.getAverageTime()
      };
    } else {
      playerName = '';
    }

    return await fetch(`./api/avgLeaderboard/${playerName}`, {
      method: method,
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
  }
}