const GRAVEDAD = 5;
const ALTURA = 350;

// const platforms = [
//   { x: 0, y: 350, width: 800, height: 50 }, // ground
//   { x: 200, y: 270, width: 120, height: 20 },
//   { x: 400, y: 200, width: 120, height: 20 },
// ];


class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.personaje = null;
    this.monedas = [];
    this.puntuacion = 0;
    this.crearEscenario();
    this.agregarEventos();
    this.puntosElement = document.getElementById("puntos");

  }

  crearEscenario() {
    this.personaje = new Personaje();
    this.container.appendChild(this.personaje.element);
    for (let i = 0; i < 5; i++) {
      const moneda = new Moneda();
      this.monedas.push(moneda);
      this.container.appendChild(moneda.element);
    }


  }

  agregarEventos() {
    window.addEventListener("keydown", (e) => this.personaje.mover(e));
    window.addEventListener("keyup", (e) => this.personaje.parar(e));
    this.checkColisiones();
  }

  checkColisiones() {
    setInterval(() => {
      this.monedas.forEach((moneda, index) => {
        if (this.personaje.colisionaCon(moneda)) {
          this.container.removeChild(moneda.element);
          this.monedas.splice(index, 1);
          this.actualizarPuntuacion(10);

        }
      });
    }, 1000 / 60); // 60 fps
  }

  actualizarPuntuacion(puntos) {
    this.puntuacion += puntos;
    this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
  }

}

class Personaje {
  static velocidadMovimiento = 15; // Velocidad de movimiento horizontal
  static velocidadSalto = 50; // Velocidad inicial de salto (se va reduciendo con la gravedad)

  constructor() {
    this.x = 50;
    this.y = 300;
    this.width = 50;
    this.height = 50;
    this.isMovingLeft = false; // Si el personaje se esta moviendo hacia la izquierda
    this.isMovingRight = false; // Si el personaje se esta moviendo hacia la derecha
    this.velocidadY = 0;
    this.saltando = false;
    this.element = document.createElement("div");
    this.element.classList.add("personaje");
    this.actualizarPosicion();
  }

  mover(evento) {
    if (evento.key === "ArrowRight") {
      this.isMovingRight = true; // Al pulsar la tecla almacenamos que el personaje se esta moviendo hacia la derecha
    }

    if (evento.key === "ArrowLeft") {
      this.isMovingLeft = true;
    }

    if ((evento.key === "ArrowUp" || evento.key === " ") && !this.saltando) {
      this.saltar();
    }
  }


  parar(evento) {
    if (evento.key === "ArrowRight") {
      this.isMovingRight = false; // Al levantar la tecla almacenamos que el personaje ya no se esta moviendo hacia la derecha
    }

    if (evento.key === "ArrowLeft") {
      this.isMovingLeft = false;
    }
  }

  saltar() {
    // Actualizamos velocidad vertical a la de salto, y vamos reduciendo en el tiempo con la gravedad
    this.velocidadY = -Personaje.velocidadSalto;
    this.saltando = true;

    const intervaloSalto = setInterval(() => {
      this.velocidadY += GRAVEDAD;
      this.y += this.velocidadY;
      // Si nos pasamos del suelo, dejamos de saltar y actualizamos la posicion a la del suelo (altura menos altura del personaje)
      if (this.y > ALTURA - this.height) {
        this.y = ALTURA - this.height;
        this.saltando = false;
        this.velocidadY = 0;
        clearInterval(intervaloSalto);
      }
    }, 1000 / 60); // 60 fps
  }

  actualizarPosicion() {
    setInterval(() => {
      // Si el personaje se esta moviendo, actualizamos su posicion horizontal en base a la velocidad de movimiento
      if (this.isMovingRight && !this.isMovingLeft) {
        this.x += Personaje.velocidadMovimiento;
      }

      if (this.isMovingLeft && !this.isMovingRight) {
        this.x -= Personaje.velocidadMovimiento;
      }

      // Pintamos nueva posicion en pantalla actualizando los estilos
      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;
    }, 1000 / 60); // 60 fps
  }

  colisionaCon(objeto) {
    return (
      this.x < objeto.x + objeto.width &&
      this.x + this.width > objeto.x &&
      this.y < objeto.y + objeto.height &&
      this.y + this.height > objeto.y
    );
  }

}

class Moneda {
  constructor() {
    this.x = Math.random() * 700 + 50;
    this.y = Math.random() * 250 + 50;
    this.width = 30;
    this.height = 30;
    this.element = document.createElement("div");
    this.element.classList.add("moneda");
    this.actualizarPosicion();
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

}

class Plataforma {
  constructor() {
    this.x = Math.random() * 700 + 50;
    this.y = Math.random() * 250 + 50;
    this.width = 50;
    this.height = 50;
    this.element = document.createElement("div");
    this.element.classList.add("plataforma");
    this.actualizarPosicion();
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

const juego = new Game();
