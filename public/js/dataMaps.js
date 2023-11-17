$(function () {
  images = {
    village: new Image(),
    villageForeground: new Image(),
    forest: new Image(),
    forestForeground: new Image(),
    house: new Image(),
    tavern: new Image(),
    potion: new Image(),
    blacksmith: new Image(),
  };

  images.village.src = "public/img/village.png"; // fonte image
  images.villageForeground.src = "public/img/village-foreground.png";
  images.forest.src = "public/img/forest.png";
  images.forestForeground.src = "public/img/forest-foreground.png";

  playerImage = {
    playerForward: new Image(),
    playerBack: new Image(),
    playerLeft: new Image(),
    playerRight: new Image(),
  };

  playerImage.playerForward.src = "public/img/player-forward.png";
  playerImage.playerBack.src = "public/img/player-back.png";
  playerImage.playerLeft.src = "public/img/player-left.png";
  playerImage.playerRight.src = "public/img/player-right.png";

  const keys = ["village", "forest"] //"house"]; //'house','tavern','potion','blacksmith'];
  // Tamanho do mapa
  const stepSize = [
    50, // Village
    40, // Forest
    15, // House
  ];

  collisionsMap = {};

  interactsMap = {};

  keys.forEach((key, index) => {
    collisionsMap[key] = [];
    interactsMap[key] = [];


    for (let i = 0; i < collisions[index].length; i += stepSize[index]) {
      collisionsMap[key].push(collisions[index].slice(i, stepSize[index] + i));
    }
    for (let i = 0; i < interacts[index].length; i += stepSize[index]) {
      interactsMap[key].push(interacts[index].slice(i, stepSize[index] + i));
    }
  });
});

