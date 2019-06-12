function getLeaderboard() {
  Api.leaderboardRequest('get', currentLevel)
    .then((response) => {
      drawLeaderboard(response);
    })

}

function drawLeaderboard(array) {
  let leaderboard = document.querySelector('.leaderboard');
  let leaderboardComponent = '';

  for (let i = 0; i < array.length; i++) {
    if (array[i][0] === player.name) {
      leaderboardComponent += `
        <li class="leaderboard-entry d-flex justify-content-between">
          <i class="fas fa-star d-flex align-self-center"></i>
          <p class="leaderboard-text text-start">${i + 1}</p>
          <p class="leaderboard-text text-center">${array[i][0]}</p>
          <p class="leaderboard-text text-end">${leaderboardSecondsToMinutes(array[i][1])}</p>
        </li>
      `
    } else {
      leaderboardComponent += `
        <li class="leaderboard-entry d-flex justify-content-between">
          <p class="leaderboard-text text-start">${i + 1}</p>
          <p class="leaderboard-text text-center">${array[i][0]}</p>
          <p class="leaderboard-text text-end">${leaderboardSecondsToMinutes(array[i][1])}</p>
        </li>
      `
    }
  }
  leaderboard.innerHTML = leaderboardComponent;
  let listItems = document.querySelectorAll('.leaderboard .leaderboard-entry');
  listItems[0] ? listItems[0].classList.add('first'):'';
  listItems[1] ? listItems[1].classList.add('second'):'';
  listItems[2] ? listItems[2].classList.add('third'):'';
}

function leaderboardSecondsToMinutes(time){
  let minutes = parseInt(time/60);
  let seconds = time % 60;

  if(seconds < 10){
    return minutes + ':0' + seconds; 
  } else {
    return minutes + ':' + seconds;
  }
}