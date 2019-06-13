function createModalGameFinished() {
  let modalContainer = document.createElement("div");
  modalContainer.setAttribute('id', 'game-finished-modal');
  modalContainer.classList.add('d-flex', 'justify-content-center', 'align-items-center');
  modalContainer.innerHTML = `
  
    <div class="modal-body d-flex flex-column align-items-center">
      
        <p>Congrats ${player.name}, You have finished all the puzzles</p>
        <p>Your average time per puzzle is: </p>
        <p> ${player.getAverageTime()} s.</p>
        <p>Think you can do better?</p>
        <button class="btn" onclick="removeModal();removeLevelFinishedAnimations();gameInitialize('new')">New game</button>

    </div>
  `;
  document.querySelector("body").appendChild(modalContainer);
}

function removeModal() {
  document.querySelector('#game-finished-modal').remove();
}