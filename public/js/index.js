const elementCanvas = document.querySelectorAll("canvas");
const canvas = elementCanvas[0];

var start  = true;

const c = canvas.getContext("2d");

    var images = {
      village: new Image(),
      villageForeground: new Image(),
      forest: new Image(),
      forestForeground: new Image(),
      house: new Image(),
      tavern: new Image(),
      potion: new Image(),
      blacksmith: new Image(),


      playerForward: new Image(),
      playerBack: new Image(),
      playerLeft: new Image(),
      playerRight: new Image(),
    };

    images.village.src = "public/img/village.png"; // fonte image
    images.villageForeground.src = "public/img/village-foreground.png";
    images.forest.src = "public/img/forest.png";
    images.forestForeground.src = "public/img/forest-foreground.png";

    images.playerForward.src = "public/img/player-forward.png";
    images.playerBack.src = "public/img/player-back.png";
    images.playerLeft.src = "public/img/player-left.png";
    images.playerRight.src = "public/img/player-right.png";

    const keys = ['village','forest'] //'house','tavern','potion','blacksmith'];
    // Tamanho do mapa
    const stepSize = [
      50, // Village
      40, // Forest
      15, // House
    ]

    var collisionsMap = {
    };

    var interactsMap = {
    };

    keys.forEach((key,index)=>{
      collisionsMap[key] = [];
      interactsMap[key] = [];

    for (let i = 0; i < collisions[index].length; i += stepSize[index]) {
      collisionsMap.village.push(collisions[index].slice(i, stepSize[index] + i));
    }

    for (let i = 0; i < interacts[index].length; i +=stepSize[index] ) {
      interactsMap.village.push(interacts[index].slice(i, stepSize[index] + i));
    }
    })

$(function () {
  function showCanvasMain(map, foreMap, collisions, interacts) {
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

    // Criando a hitbox de interação
    const interactionChangeMap = [];
    const interactionChangeHouse = [];
    const interactionChangeTavern = [];
    const interactionChangePotion = [];
    const interactionChangeBlackSmith = [];

    interacts.forEach((row, i) => {
      row.forEach((Symbol, j) => {
        if (Symbol === 4171)
          interactionChangeMap.push(
            new Boundary({
              position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y,
              },
            }),
          );

        if (Symbol === 4170)
          interactionChangeHouse.push(
            new Boundary({
              position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y,
              },
            }),
          );

        if (Symbol === 4192)
          interactionChangeTavern.push(
            new Boundary({
              position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y,
              },
            }),
          );

        if (Symbol === 4173)
          interactionChangePotion.push(
            new Boundary({
              position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y,
              },
            }),
          );

        if (Symbol === 4172)
          interactionChangeBlackSmith.push(
            new Boundary({
              position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y,
              },
            }),
          );
      });
    });

    //  Criando a hitbox de colisão
    const boundaries = [];
    collisions.forEach((row, i) => {
      row.forEach((Symbol, j) => {
        if (Symbol === 4169)
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

    // instanciando o sprite do boneco
    const player = new Sprite({
      position: {
        //                    {672 e 96} dimensao da imagem do personagem
        x: canvas.width / 2 - 672 / 4 / 2, // coordenada X,
        y: canvas.height / 2 - 96 / 2, // coordenada Y
      },
      image: images.playerBack, // fonte da imagem
      frames: {
        max: 3, // quantidade de sprites na imagem
      },
      sprites: {
        back: images.playerBack,
        right: images.playerRight, // Sprite do lado direito
        left: images.playerLeft, // Sprite do lado esquerdo
        forward: images.playerForward,
      },
    });

    // Posicionar a imagem do map no html
    const referencePoint = new Sprite({
      position: {
        x: offset.x,
        y: offset.y,
      },
      image: map,
    });

    // Posição do objetos sobre o personagem ex: arvore
    const villageForeground = new Sprite({
      position: {
        x: offset.x,
        y: offset.y,
      },
      image: foreMap
    });

    // Entepretar a hitbox de colisão
    function rectagularCollision({ rectangle1, rectangle2 }) {
      return (
        rectangle1.position.x - 19 + rectangle1.width >=
          rectangle2.position.x &&
        rectangle1.position.x <=
          rectangle2.position.x - 19 + rectangle2.width &&
        rectangle1.position.y <=
          rectangle2.position.y - 40 + rectangle2.height &&
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
    const movables = [
      referencePoint,
      ...boundaries,
      villageForeground,
      ...interactionChangeMap,
      ...interactionChangeHouse,
      ...interactionChangeTavern,
      ...interactionChangeBlackSmith,
      ...interactionChangePotion,
    ];

    // Animação
    function animation() {
      window.requestAnimationFrame(animation);
      referencePoint.draw();

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

      player.draw();
      villageForeground.draw();

      let moving = true;
      player.moving = false;
      // Andar do personagem para frente
      if (keys.w.pressed && lastKey === "w") {
        player.moving = true;
        player.image = player.sprites.forward; // mudar de sprite
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            rectagularCollision({
              rectangle1: player,
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
        player.moving = true;
        player.image = player.sprites.back; // mudar de sprite
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            rectagularCollision({
              rectangle1: player,
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
        player.moving = true;
        player.image = player.sprites.left; // mudar de sprite
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            rectagularCollision({
              rectangle1: player,
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
        player.moving = true;
        player.image = player.sprites.right; // mudar de sprite
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            rectagularCollision({
              rectangle1: player,
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
              rectangle1: player,
              rectangle2: interact,
            })
          ) {
            console.log("Change map");
            // plot_terminl();
            // plot_dialog();
          }
        }
        for (let i = 0; i < interactionChangeHouse.length; i++) {
          const interact = interactionChangeHouse[i];
          if (
            rectagularCollision({
              rectangle1: player,
              rectangle2: interact,
            })
          ) {
            showCanvasMain(images.forest,
              images.forestForeground,
              collisionsMap.forest,
              interactsMap.forest);
          }
        }

        for (let i = 0; i < interactionChangePotion.length; i++) {
          const interact = interactionChangePotion[i];
          if (
            rectagularCollision({
              rectangle1: player,
              rectangle2: interact,
            })
          ) {
            TradeCanvas(
              "public/img/forest.png",
              "public/img/forest-foreground.png",
            );
          }
        }

        for (let i = 0; i < interactionChangeTavern.length; i++) {
          const interact = interactionChangeTavern[i];
          if (
            rectagularCollision({
              rectangle1: player,
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
              rectangle1: player,
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
  }

  console.log("chama canvas");
  showCanvasMain(images.village,images.villageForeground,collisionsMap.village,interactsMap.village);

  function gameLoop() {

    if (start){
    showCanvasMain(images.village,images.villageForeground,collisionsMap.village,interactsMap.village);
    start = false
    }

    requireAnimationFrame(gameLoop);

    gameLoop()
  }


  // Audio
  /* let clicked = false;
  addEventListener("click", () => {
    if (!clicked) {
      audio.Map.play();
      clicked = true;
    }
  }); */
});
