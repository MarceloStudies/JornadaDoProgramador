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
  maps.forest.src = "public/img/forest.png";

  foreMaps.village.src = "public/img/village-foreground.png";
  foreMaps.forest.src = "public/img/forest-foreground.png";

  heroImage = {
    forward: new Image(),
    back: new Image(),
    left: new Image(),
    right: new Image(),
  };

  heroImage.forward.src = "public/img/player-forward.png";
  heroImage.back.src = "public/img/player-back.png";
  heroImage.left.src = "public/img/player-left.png";
  heroImage.right.src = "public/img/player-right.png";

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

    if (Array.isArray(collisions[index])) {
      for (let i = 0; i < collisions[index].length; i += stepSize[index]) {
        collisionsMap[key].push(
          collisions[index].slice(i, stepSize[index] + i)
        );
      }
    }

    if (Array.isArray(interacts[index])) {
      for (let i = 0; i < interacts[index].length; i += stepSize[index]) {
        interactsMap[key].push(interacts[index].slice(i, stepSize[index] + i));
      }
    }
  });
});
