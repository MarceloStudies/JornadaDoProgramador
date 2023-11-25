const elementCanvas = document.querySelector("canvas");
const canvas = elementCanvas;

const c = canvas.getContext("2d");

// Jquery Principal
$(function () {
  const [canvasWidth, canvasHeight] = [
    $("#map").innerWidth(),
    $("#map").innerHeight(),
  ];

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const offset = {
    x: -1650,
    y: -2800,
  };

  function collisions(collisionMap, hitbox) {
    const boundaries = [];

    if (!Array.isArray(collisionMap)) {
      return boundaries;
    }

    collisionMap.forEach((row, i) => {
      if (!Array.isArray(row)) {
        return;
      }

      row.forEach((Symbol, j) => {
        if (Symbol === hitbox)
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y,
              },
            }),
          );
      });
    });

    return boundaries;
  }

  function interacts(interactMap, symbol) {
    const interations = [];

    if (!Array.isArray(interactMap)) {
      return interations;
    }

    interactMap.forEach((row, i) => {
      if (!Array.isArray(row)) {
        return;
      }

      row.forEach((Symbol, j) => {
        if (Symbol === symbol)
          interations.push(
            new Boundary({
              position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y,
              },
            }),
          );
      });
    });

    return interations;
  }

  function movable({ data }) {
    movables = [data.map, ...data.collision, data.foreMap, ...data.interact];
  }

  const keys = {
    w: {
      pressed: false,
    },
    s: {
      pressed: false,
    },
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    e: {
      pressed: false,
    },
  };

  let lastKey = "";

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
        keys.w.pressed = true;
        lastKey = "w";
        break;
      case "s":
        keys.s.pressed = true;
        lastKey = "s";
        break;
      case "a":
        keys.a.pressed = true;
        lastKey = "a";
        break;
      case "d":
        keys.d.pressed = true;
        lastKey = "d";
        break;
      case "e":
        keys.e.pressed = true;
        lastKey = "e";
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "w":
        keys.w.pressed = false;
        break;
      case "s":
        keys.s.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
      case "d":
        keys.d.pressed = false;
        break;
    }
  });

  const hero = new Sprite({
    position: {
      x: canvas.width / 2 - 144 / 3 / 2,
      y: canvas.height / 2 - 92 / 2,
    },
    image: heroImage.back,
    frames: {
      max: 3,
    },
    sprites: {
      back: heroImage.back,
      right: heroImage.right,
      left: heroImage.left,
      forward: heroImage.forward,
    },
  });

  const map = new Sprite({
    position: {
      x: offset.x,
      y: offset.y,
    },
    image: maps.village,
  });

  const foreMap = new Sprite({
    position: {
      x: offset.x,
      y: offset.y,
    },
    image: foreMaps.village,
  });

  let boundaries = collisions(collisionsMap.village, 4169);
  let interactionChangeMap = interacts(interactsMap.village, 4171);
  movable({
    data: {
      map,
      collision: boundaries,
      foreMap,
      interact: interactionChangeMap,
    },
  });

  function rectagularCollision({ rect1, rect2 }) {
    return (
      rect1.position.x + rect1.width >= rect2.position.x &&
      rect1.position.x <= rect2.position.x + rect2.width &&
      rect1.position.y <= rect2.position.y + rect2.height &&
      rect1.position.y + rect1.height >= rect2.position.y
    );
  }

  function changeMap(collisionMap, interactMap, mapImage, foreMapImage) {
    boundaries = collisions(collisionMap);
    interactionChangeMap = interacts(interactMap);

    map.image = mapImage;
    foreMap.image = foreMapImage;

    animation();
  }

  function animation() {
    window.requestAnimationFrame(animation);

    map.draw();

    boundaries.forEach((boundary) => {
      boundary.draw();
    });

    interactionChangeMap.forEach((boundary) => {
      boundary.draw();
    });

    hero.draw();
    foreMap.draw();

    let moving = true;
    hero.moving = false;

    if (keys.w.pressed && lastKey === "w") {
      hero.moving = true;
      hero.image = hero.sprites.forward;

      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];

        if (
          rectagularCollision({
            rect1: hero,
            rect2: {
              ...boundary,
              position: {
                x: boundary.position.x,
                y: boundary.position.y + 3,
              },
            },
          })
        ) {
          moving = false;
          break;
        }
      }

      if (moving)
        movables.forEach((movable) => {
          movable.position.y += 3;
        });
    }

    if (keys.s.pressed && lastKey === "s") {
      hero.moving = true;
      hero.image = hero.sprites.back;

      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];

        if (
          rectagularCollision({
            rect1: hero,
            rect2: {
              ...boundary,
              position: {
                x: boundary.position.x,
                y: boundary.position.y - 3,
              },
            },
          })
        ) {
          moving = false;
          break;
        }
      }

      if (moving)
        movables.forEach((movable) => {
          movable.position.y -= 3;
        });
    }

    if (keys.a.pressed && lastKey === "a") {
      hero.moving = true;
      hero.image = hero.sprites.left;

      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];

        if (
          rectagularCollision({
            rect1: hero,
            rect2: {
              ...boundary,
              position: {
                x: boundary.position.x + 3,
                y: boundary.position.y,
              },
            },
          })
        ) {
          moving = false;
          break;
        }
      }

      if (moving)
        movables.forEach((movable) => {
          movable.position.x += 3;
        });
    }

    if (keys.d.pressed && lastKey === "d") {
      hero.moving = true;
      hero.image = hero.sprites.right;

      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];

        if (
          rectagularCollision({
            rect1: hero,
            rect2: {
              ...boundary,
              position: {
                x: boundary.position.x - 3,
                y: boundary.position.y,
              },
            },
          })
        ) {
          moving = false;
          break;
        }
      }

      if (moving)
        movables.forEach((movable) => {
          movable.position.x -= 3;
        });
    }

    if (keys.e.pressed) {
      for (let i = 0; i < interactionChangeMap.length; i++) {
        const interact = interactionChangeMap[i];

        if (
          rectagularCollision({
            rect1: hero,
            rect2: {
              ...interact,
            },
          })
        ) {
          console.log("press e");
          changeMap(
            collisions(collisionsMap.forest, 2468),
            interacts(interactsMap.forest, 4171),
            maps.forest,
            foreMaps.forest,
          );
        }
      }
    }

    keys.e.pressed = false;
    moving = false;
  }

  animation();
});
