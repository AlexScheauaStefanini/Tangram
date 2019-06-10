function newLevelAnimations(){
  removeLevelFinishedAnimations();

  let gameContainer = document.querySelector("#game");
  let stroke = document.querySelector("#stroke");
  let pieces = document.querySelectorAll(".piece");
  let timer = document.querySelector(".timer-container");
  
  gameContainer.classList.add('game-appearing');
  gameContainer.style.opacity = 1;

  timer.classList.add('timer-appearing');
  timer.style.opacity = 1;

  stroke.classList.add('stroke-apearing');
  stroke.style.opacity = 1;

  pieces.forEach((piece,i)=>{
    //asez piesele in forma initiala
    piece.style.top = (origins[i].top + dragOffsetY) + "px";
    piece.style.left = (origins[i].left + stroke.offsetLeft + 100) + "px";
    
    
    piece.style.transform = origins[i].transform;
    pieces[i].firstElementChild.classList.remove("in-place");
    
    if(piece.style.transform === "rotate(90deg)"){
      piece.firstElementChild.classList.add('svg-container-appearing-rotated');
    } else{
      piece.firstElementChild.classList.add('svg-container-appearing');
    }
    piece.style.opacity = 1;
  })
  
  
  document.querySelector("#game").addEventListener('animationend',()=>{
    resetOffsets();
    document.querySelector("#game").classList.remove('game-appearing');
    document.querySelector("#stroke").classList.remove('stroke-apearing');
    pieces.forEach(piece=>{
      piece.firstElementChild.classList.remove('svg-container-appearing');
    })
    timer.classList.remove('timer-appearing');
    
  },{once:true})
}