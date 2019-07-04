function devOnly() {
	document.querySelector('#devOnly').innerText = `devonly ${currentLevel}`;
}


function positionGenerator() { // genereaza jsonul pentru validarea nivelelor
  let pieces = document.querySelectorAll('.piece');
  let validationSchema = {
    "big-t": [],
    "med-t": [],
    "para": [],
    "small-t": [],
    "square": []
  };

  for (let i = 0; i < pieces.length; i++) {
    let piece = pieces[i].firstElementChild.id;
    if (piece === 'big-') {
      piece = 'big-t';
    } else if (piece === 'small-') {
      piece = 'small-t';
    }

    validationSchema[piece].push({
      "top": parseInt(pieces[i].style.top) - gameOffsetY,
      "left": parseInt(pieces[i].style.left) - gameOffsetX,
      "transform": pieces[i].style.transform
    })
  }
  console.log(JSON.stringify(validationSchema));
}