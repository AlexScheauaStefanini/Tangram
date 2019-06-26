let Origins = { //functie care genereaza originile pieselor in functie de dimensiunea ecranului si de wrappingul game-container. apelata din reset-pieces
  referenceCoordinates: [
    { "top": -13, "left": 0, "transform": "rotate(0deg)" },
    { "top": 84, "left": 115, "transform": "rotate(90deg)" },
    { "top": 200, "left": -5, "transform": "rotate(0deg)" },
    { "top": 90, "left": -90, "transform": "rotate(90deg)" },
    { "top": 279, "left": 191, "transform": "rotate(0deg)" },
    { "top": 131, "left": 46, "transform": "rotate(90deg)" },
    { "top": 202, "left": 103, "transform": "rotate(0deg)" }
  ],

  stroke: document.querySelector('#stroke'), //in functie de offsetul stroke se pozitioneaza piesele cand screenwidth este mai mare de 1365px

  pieceOriginalCoords: [
    { "top": -13, "left": 0, "transform": "rotate(0deg)" },
    { "top": 84, "left": 115, "transform": "rotate(90deg)" },
    { "top": 200, "left": -5, "transform": "rotate(0deg)" },
    { "top": 90, "left": -90, "transform": "rotate(90deg)" },
    { "top": 279, "left": 191, "transform": "rotate(0deg)" },
    { "top": 131, "left": 46, "transform": "rotate(90deg)" },
    { "top": 202, "left": 103, "transform": "rotate(0deg)" }
  ],

  originsRecalculation: function () {
    if (window.innerWidth < 1365) {
      for (let i = 0; i < this.referenceCoordinates.length; i++) {this.pieceOriginalCoords[i].left = this.referenceCoordinates[i].left + (window.innerWidth / 2) - 180;
      }
    } else {
      for (let i = 0; i < this.referenceCoordinates.length; i++) {this.pieceOriginalCoords[i].left = this.referenceCoordinates[i].left + (window.innerWidth / 2) + 80;
      }
    }
  }
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