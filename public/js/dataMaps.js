$(function () {
  maps = {
    village: new Image(),
    forest: new Image(),
    house: new Image(),
    tavern: new Image(),
    potion: new Image(),
    blacksmith: new Image(),
  };

  foreMaps = {
    village: new Image(),
    forest: new Image(),
  };

  maps.village.src = "public/img/village.png"; // fonte image
  foreMaps.village.src = "public/img/village-foreground.png";
  maps.forest.src = "public/img/forest.png";
  foreMaps.forest.src = "public/img/forest-foreground.png";

  heroImages = {
    forward: new Image(),
    back: new Image(),
    left: new Image(),
    right: new Image(),
  };

  heroImages.forward.src = "public/img/player-forward.png";
  heroImages.back.src = "public/img/player-back.png";
  heroImages.left.src = "public/img/player-left.png";
  heroImages.right.src = "public/img/player-right.png";

  const keys = ["village", "forest"]; //"house"]; //'house','tavern','potion','blacksmith'];
  // Tamanho do mapa
  const stepSize = [
    50, // Village
    50, // Forest
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
