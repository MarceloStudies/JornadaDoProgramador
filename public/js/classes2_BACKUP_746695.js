class Sprite {
  constructor({ position, image, frames = { max: 1 }, sprites }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.moving = false;
    this.sprites = sprites;
  }

  draw() {
    c.drawImage(
      this.image,
      this.frames.val * this.width, // Inicio do sprite
      0, // Altura do sprite
      this.image.width / this.frames.max, // Recorde do sprite vertical
      this.image.height, // Recorde do sprite na horizontal
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height,
    );
    if (!this.moving) return;
    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % 6 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

class Boundary {
  static width = 48 * 2; // tamanho do mapa vezes o zoom 32 largura com 4 por causa do zoom de 400
  static height = 48 * 2; // "" 32 de altura ""
  constructor({ position }) {
    this.position = position;
    this.width = Boundary.width;
    this.height = Boundary.height;
  }
  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0.0)";
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
