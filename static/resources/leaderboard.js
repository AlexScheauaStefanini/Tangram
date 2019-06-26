function getLevelLeaderboard(level) {
  Api.leaderboardRequest('get', level)
    .then(response => {
      drawLeaderboard(response,level);
    })
}

function getAverageLeaderboard(){
  Api.avgLeaderboardRequest()
  .then(response => {
    drawLeaderboard(response);
  })
}

function drawLeaderboard(array,level) {
  let leaderboard = document.querySelector('.leaderboard');
  let leaderboardTitle = document.querySelector('#leaderboard-title-text')
  let leaderboardComponent = '';

  if(level){
    leaderboardTitle.innerText = `LEVEL ${level} LEADERBOARD`;
  } else {
    leaderboardTitle.innerText = `AVERAGE TIMES LEADERBOARD`;
    level = '';
  }

  for (let i = 0; i < array.length; i++) {
    if (array[i][0] === player.name) {
      leaderboardComponent += `
        <li class="leaderboard-entry d-flex">
          <i class="fas fa-star d-flex align-self-center"></i>
          <div class="w-100 d-flex justify-content-between">
            <p class="leaderboard-text text-start">${i + 1}</p>
            <p class="leaderboard-text text-center">${array[i][0]}</p>
            <p class="leaderboard-text text-end">${leaderboardSecondsToMinutes(array[i][1],level)}</p>
          </div>
        </li>
      `
    } else {
      leaderboardComponent += `
        <li class="leaderboard-entry d-flex justify-content-between">
          <p class="leaderboard-text text-start">${i + 1}</p>
          <p class="leaderboard-text text-center">${array[i][0]}</p>
          <p class="leaderboard-text text-end">${leaderboardSecondsToMinutes(array[i][1],level)}</p>
        </li>
      `
    }
  }

  leaderboard.innerHTML = leaderboardComponent;
  let listItems = document.querySelectorAll('.leaderboard .leaderboard-entry');
  listItems[0] ? listItems[0].classList.add('first') : '';
  listItems[1] ? listItems[1].classList.add('second') : '';
  listItems[2] ? listItems[2].classList.add('third') : '';
}

function leaderboardSecondsToMinutes(time,level) {
  let minutes = parseInt(time / 60);
  let seconds = time % 60;
  if(!level){
    if (seconds < 10) {
      return minutes + ':0' + seconds.toFixed(2);
    } else {
      return minutes + ':' + seconds.toFixed(2);
    }
  } else {
    if (seconds < 10) {
      return minutes + ':0' + seconds;
    } else {
      return minutes + ':' + seconds;
    }
  }
  
}