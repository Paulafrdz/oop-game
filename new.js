const GRAVEDAD = 5;
const ALTURA = 350;
const ANCHO = 800;

// const platforms = [
//   { x: 0, y: 350, width: 800, height: 50 }, // ground
//   { x: 200, y: 270, width: 120, height: 20 },
//   { x: 400, y: 200, width: 120, height: 20 },
// ];
const bgMusic = new Audio('audio/game-music-loop-6-144641.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");

const musicCoin = new Audio('audio/coin-collision-sound-342335.mp3');
musicCoin.volume = 0.7;

playBtn.addEventListener("click", () => {
    bgMusic.play()
        .then(() => console.log("🎶 Música iniciada"))
        .catch(e => console.error("❌ No se pudo reproducir:", e));
});

pauseBtn.addEventListener("click", () => {
    bgMusic.pause();
    console.log("⏸ Música pausada");
});


class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.personaje = null;
    this.monedas = [];
    this.puntuacion = 0;
    this.crearEscenario();
    this.agregarEventos();
    this.puntosElement = document.getElementById("puntos");
    this.overlay = document.getElementById("win-overlay");
    bgMusic.play();
    this.setTime = Date.now();
    this.updateTime();
    this.timerElement = document.querySelector("#timer span");
    this.restartBtn = document.getElementById("restart-btn");
    this.restartBtn.addEventListener("click", () => {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    location.reload();
    });
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

    updateTime() {
      setInterval(() => {
        const time = Math.floor((Date.now() - this. setTime) / 1000);
        this.timerElement.textContent = time;
      }, 1000);
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
          musicCoin.currentTime = 0;
          musicCoin.play();

          if (this.monedas.length === 0) {
            this.mostrarVentanaGanadora();
            const endTime = Math.floor((Date.now() - this.setTime) / 1000);
        }
      }
      });
    }, 1000 / 60); // 60 fps
  }

  mostrarVentanaGanadora() {
        this.overlay.style.display = 'flex';
        const winMessage = document.getElementById('win-message'); 
        this.gameStarted = false; 
  }

  actualizarPuntuacion(puntos) {
    this.puntuacion += puntos;
    this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
  }
  
}


class Personaje {
  static velocidadMovimiento = 10; // Velocidad de movimiento horizontal
  static velocidadSalto = 50; // Velocidad inicial de salto (se va reduciendo con la gravedad)

  constructor() {
    this.x = 50;
    this.y = 250;
    this.width = 100;
    this.height = 100;
    this.isMovingLeft = false; // Si el personaje se esta moviendo hacia la izquierda
    this.isMovingRight = false; // Si el personaje se esta moviendo hacia la derecha
    this.velocidadY = 0;
    this.saltando = false;
    this.element = document.createElement("div");
    this.element.classList.add("personaje");
    this.actualizarPosicion();
    setInterval(() => {
      this.actualizarPosicion();
    }, 1000 / 60); // 60 fps
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
    // Si el personaje se esta moviendo, actualizamos su posicion horizontal en base a la velocidad de movimiento
    if (this.isMovingRight && !this.isMovingLeft) {
      this.x += Personaje.velocidadMovimiento;
    }

    if (this.isMovingLeft && !this.isMovingRight) {
      this.x -= Personaje.velocidadMovimiento;
    }

    //Que no se salga de los margenes
    if(this.x < 0 ) {
      this.x = 0;
    } 

    if(this.x > ANCHO - this.width) {
      this.x = ANCHO - this.width;
    }

    // Pintamos nueva posicion en pantalla actualizando los estilos
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
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

const juego = new Game();
