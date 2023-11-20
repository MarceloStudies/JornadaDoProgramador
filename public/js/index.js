const elementCanvas = document.querySelector("canvas");
const canvas = elementCanvas;

var c = canvas.getContext("2d");
var start = true;

$(function () {
  // Coletando a proprosão, lagura e comprimento
  let [width, height] = [$("#map").innerWidth(), $("#map").innerHeight()];
  const aspectRatio = width / height;
  const canvasWidth = width;
  const canvasHeigh = width / aspectRatio;

  // Dimensão do jogo
  canvas.width = canvasWidth;
  canvas.height = canvasHeigh;

  // localizao do eixo X e Y onde o troia inicia
  const offset = {
    x: -1650,
    y: -2700,
  };

  function generateBoundaries(newCollisions, newSymbolCollision) {
    var boundaries = [];
    newCollisions.forEach((row, i) => {
      row.forEach((Symbol, j) => {
        if (Symbol === newSymbolCollision)
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y,
              },
            })
          );
      });
    });
    return boundaries;
  }

  // Criando a hitbox de interação
  const interactionChangeMap = [];
  const interactionChangeHouse = [];
  const interactionChangeTavern = [];
  const interactionChangePotion = [];
  const interactionChangeBlackSmith = [];

  var interacts = interactsMap.village;

  interacts.forEach((row, i) => {
    row.forEach((Symbol, j) => {
      if (Symbol === 4171)
        interactionChangeMap.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );

      if (Symbol === 4170)
        interactionChangeHouse.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );

      if (Symbol === 4192)
        interactionChangeTavern.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );

      if (Symbol === 4173)
        interactionChangePotion.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );

      if (Symbol === 4172)
        interactionChangeBlackSmith.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );
    });
  });

  let symbolCollision = 4169;
  //  Criando a hitbox de colisão
  let boundaries = [];
  let collisions = collisionsMap.village;
  collisions.forEach((row, i) => {
    row.forEach((Symbol, j) => {
      if (Symbol === symbolCollision)
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );
    });
  });

  // instanciando a image

  // Inicando o controle com nenhuma tecla pressionada
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

  // LaskKey para indentificar qual foi a ultima tecla pressionada
  let lastKey = "";

  // Interação do teclado com o jogo quando pressionado
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

  // Mudar o estado do controle se não o boneco anda sozinho
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

  var hero = new Sprite({
    position: {
      //                    {672 e 96} dimensao da imagem do personagem
      x: canvas.width / 2 - 672 / 4 / 2, // coordenada X,
      y: canvas.height / 2 - 96 / 2, // coordenada Y
    },
    image: playerImage.playerBack,
    frames: {
      max: 3, // quantidade de sprites na imagem
    },
    sprites: {
      back: playerImage.playerBack,
      right: playerImage.playerRight, // Sprite do lado direito
      left: playerImage.playerLeft, // Sprite do lado esquerdo
      forward: playerImage.playerForward,
    },
  });

  // Posicionar a imagem do map no html

  var mainMap = new Sprite({
    position: {
      x: offset.x,
      y: offset.y,
    },
    image: images.village,
  });

  // Posição do objetos sobre o personagem ex: arvore
  var foregroundMap = new Sprite({
    position: {
      x: offset.x,
      y: offset.y,
    },
    image: images.villageForeground,
  });

  // instanciando o t cavasprite do boneco

  // Entepretar a hitbox de colisão
  function rectagularCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.position.x - 19 + rectangle1.width >= rectangle2.position.x &&
      rectangle1.position.x <= rectangle2.position.x - 19 + rectangle2.width &&
      rectangle1.position.y <= rectangle2.position.y - 40 + rectangle2.height &&
      rectangle1.position.y - 19 + rectangle1.height >= rectangle2.position.y
    );
  }

  // Entepretar a hitbox de interação
  function rectagularInteract({ rectangle1, rectangle2 }) {
    return (
      rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
      rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
      rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
      rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    );
  }

  // Mover imagens no mapa
  var movables = [
    mainMap,
    ...boundaries,
    foregroundMap,
    ...interactionChangeMap,
    ...interactionChangeHouse,
    ...interactionChangeTavern,
    ...interactionChangeBlackSmith,
    ...interactionChangePotion,
  ];

  // Animação
  function animation() {
    window.requestAnimationFrame(animation);
    mainMap.draw();

    boundaries.forEach((boundary) => {
      boundary.draw();
    });

    interactionChangeMap.forEach((interact) => {
      interact.draw();
    });

    interactionChangeHouse.forEach((interact) => {
      interact.draw();
    });

    interactionChangeTavern.forEach((interact) => {
      interact.draw();
    });

    interactionChangePotion.forEach((interact) => {
      interact.draw();
    });

    interactionChangeTavern.forEach((interact) => {
      interact.draw();
    });

    interactionChangeBlackSmith.forEach((interact) => {
      interact.draw();
    });

    hero.draw();
    foregroundMap.draw();

    let moving = true;
    hero.moving = false;
    // Andar do personagem para frente
    if (keys.w.pressed && lastKey === "w") {
      hero.moving = true;
      hero.image = hero.sprites.forward; // mudar de sprite
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          rectagularCollision({
            rectangle1: hero,
            rectangle2: {
              ...boundary,
              position: {
                x: boundary.position.x,
                y: boundary.position.y + 4,
              },
            },
          })
        ) {
          // myAlert("Colisao");
          moving = false;
          break;
        }
      }
      if (moving)
        movables.forEach((movable) => {
          movable.position.y += 4;
        });
    }
    // Andar do personagem para tras
    if (keys.s.pressed && lastKey === "s") {
      hero.moving = true;
      hero.image = hero.sprites.back; // mudar de sprite
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          rectagularCollision({
            rectangle1: hero,
            rectangle2: {
              ...boundary,
              position: {
                x: boundary.position.x,
                y: boundary.position.y - 4,
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
          movable.position.y -= 4;
        });
    }

    // Andar do personagem para esquerda
    if (keys.a.pressed && lastKey === "a") {
      hero.moving = true;
      hero.image = hero.sprites.left; // mudar de sprite
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          rectagularCollision({
            rectangle1: hero,
            rectangle2: {
              ...boundary,
              position: {
                x: boundary.position.x + 4,
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
          movable.position.x += 4;
        });
    }
    // Andar do personagem para Direita
    if (keys.d.pressed && lastKey === "d") {
      hero.moving = true;
      hero.image = hero.sprites.right; // mudar de sprite
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          rectagularCollision({
            rectangle1: hero,
            rectangle2: {
              ...boundary,
              position: {
                x: boundary.position.x - 4,
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
          movable.position.x -= 4;
        });
    }
    // Botao de interação
    if (keys.e.pressed) {
      for (let i = 0; i < interactionChangeMap.length; i++) {
        const interact = interactionChangeMap[i];
        if (
          rectagularCollision({
            rectangle1: hero,
            rectangle2: interact,
          })
        ) {
          mainMap.image = images.forest;
          foregroundMap.image = images.forestForeground;
          boundaries = [];
          symbolCollision = 3221227937;

          //  Criando a hitbox de colisão
          collisions = collisionsMap.forest;
          collisions.forEach((row, i) => {
            row.forEach((Symbol, j) => {
              if (Symbol === symbolCollision)
                boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width + offset.x,
                      y: i * Boundary.height + offset.y,
                    },
                  })
                );
            });
          });

          movables = [
            mainMap,
            ...boundaries,
            foregroundMap,
            ...interactionChangeMap,
            ...interactionChangeHouse,
            ...interactionChangeTavern,
            ...interactionChangeBlackSmith,
            ...interactionChangePotion,
          ];
        }
      }
      for (let i = 0; i < interactionChangeHouse.length; i++) {
        const interact = interactionChangeHouse[i];
        if (
          rectagularCollision({
            rectangle1: hero,
            rectangle2: interact,
          })
        ) {
        }
      }

      for (let i = 0; i < interactionChangePotion.length; i++) {
        const interact = interactionChangePotion[i];
        if (
          rectagularCollision({
            rectangle1: hero,
            rectangle2: interact,
          })
        ) {
        }
      }

      for (let i = 0; i < interactionChangeTavern.length; i++) {
        const interact = interactionChangeTavern[i];
        if (
          rectagularCollision({
            rectangle1: hero,
            rectangle2: interact,
          })
        ) {
          console.log("Change tavern");
        }
      }

      for (let i = 0; i < interactionChangeBlackSmith.length; i++) {
        const interact = interactionChangeBlackSmith[i];
        if (
          rectagularCollision({
            rectangle1: hero,
            rectangle2: interact,
          })
        ) {
          callQuestions("");
        }
      }
    }
    keys.e.pressed = false;
  }
  animation();

  // Audio
  /* let clicked = false;
  addEventListener("click", () => {
    if (!clicked) {
      audio.Map.play();
      clicked = true;
    }
  }); */
});
