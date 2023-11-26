const elementCanvas = document.querySelector("canvas");
const canvas = elementCanvas;

var c = canvas.getContext("2d");

$(function () {
  // Coletando a proprosão, lagura e comprimento
  //
  const canvasWidth = $("#map").width();
  const canvasHeigh = $("#map").height();

  // Dimensão do jogo
  canvas.width = canvasWidth;
  canvas.height = canvasHeigh;

  // localizao do eixo X e Y onde o troia inicia
  const offset = {
    x: -1650,
    y: -2800,
  };
  //
  // Criando a hitbox de interação

  function collisionsBoundaries(collisions, symbol, offset) {
    const boundaries = [];
    collisions.forEach((row, i) => {
      row.forEach((Symbol, j) => {
        if (Symbol === symbol)
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
  function interactionsBoundaries(interacts, symbol, offset) {
    const interactions = [];
    interacts.forEach((row, i) => {
      row.forEach((Symbol, j) => {
        if (symbol.includes(Symbol)) {

          const isNPC = Symbol === 5000;
          
          interactions.push(
            new Boundary({
              position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y,
              },
              isNPC: isNPC,
            })
          );
        }
      });
    });
    return interactions;
  }

  const mapInteractions = {
    village: [4171, 4170, 4172, 4173, 4192],
    forest: [4171,5000],
  };

  //  Criando a hitbox de colisão
  var boundaries = collisionsBoundaries(collisionsMap.village, 4169, offset);
  var interactions = interactionsBoundaries(
    interactsMap.village,
    mapInteractions.village,
    offset
  );

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
      x: canvas.width / 2 - 144 / 3 / 2, // coordenada X,
      y: canvas.height / 2 - 92 / 2, // coordenada Y
    },
    image: heroImages.back,
    frames: {
      max: 3, // quantidade de sprites na imagem
    },
    sprites: {
      back: heroImages.back,
      right: heroImages.right, // Sprite do lado direito
      left: heroImages.left, // Sprite do lado esquerdo
      forward: heroImages.forward,
    },
  });

  // Posicionar a imagem do map no html

  var map = new Sprite({
    position: {
      x: offset.x,
      y: offset.y,
    },
    image: maps.village,
  });

  // Posição do objetos sobre o personagem ex: arvore
  var foreMap = new Sprite({
    position: {
      x: offset.x,
      y: offset.y,
    },
    image: foreMaps.village,
  });

  // Entepretar a hitbox de colisão
  function rectagularCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.position.x - 20 + rectangle1.width >= rectangle2.position.x &&
      rectangle1.position.x <= rectangle2.position.x - 20 + rectangle2.width &&
      rectangle1.position.y <= rectangle2.position.y - 25 + rectangle2.height &&
      rectangle1.position.y - 25 + rectangle1.height >= rectangle2.position.y
    );
  }

  // Mover imagens no mapa
  var movables = [map, ...boundaries, foreMap, ...interactions];

  // Animação
  function animation() {
    window.requestAnimationFrame(animation);
    map.draw();

    boundaries.forEach((boundary) => {
      boundary.draw();
    });

    interactions.forEach((interact) => {
      interact.draw();
    });

    hero.draw();
    foreMap.draw();

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
                y: boundary.position.y + 3,
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
          movable.position.y += 3;
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
    // Botao de interação
    if (keys.e.pressed) {
      for (let i = 0; i < interactions.length; i++) {
        const interact = interactions[i];
        if (
          rectagularCollision({
            rectangle1: hero,
            rectangle2: interact,
          })
        ) {
          const offsetForest = {
            x: -1574,
            y: -2969,
          };
          if (interact.isNPC) {
            alert("npc");
            // callQuestions("Variáveis e Tipos de Dados");
          } else {
            map.image = maps.forest;
            foreMap.image = foreMaps.forest;

            boundaries = collisionsBoundaries(
              collisionsMap.forest,
              2468,
              offsetForest
            );

            interactions = interactionsBoundaries(
              interactsMap.forest,
              mapInteractions.forest,
              offsetForest
            );

            movables = [map, ...boundaries, foreMap, ...interactions];
          }
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
