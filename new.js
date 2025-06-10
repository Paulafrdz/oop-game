 

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
  }, 100);
  } 

  actualizarPuntuacion(puntos) {
    this.puntuacion += puntos;
    this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
  }

}

class Personaje {
    constructor() {
        this.x = 50;
        this.y = 300;
        this.width = 50; 
        this.height = 50;
        this.velocidad = 10;
        this.saltando = false;
        this.element = document.createElement("div");
        this.element.classList.add("personaje"); 
        this.enSuelo = false;
        this.velocidadSalto = 0; // ✅ Add this
        this.gravedad = 0.8;     // ✅ Add this
        this.actualizarPosicion();
        this.actualizarFisicas();
	}

	mover(evento) {
        if (evento.key === "ArrowRight") {
            this.x += this.velocidad;
        } else if (evento.key === "ArrowLeft") {
            this.x -= this.velocidad;
        } else if ((evento.key === "ArrowUp" || evento.key === " ") && this.enSuelo) {
            this.saltar();
        }             
        this.actualizarPosicion();   
	}

	saltar() {   
        this.velocidadSalto = -15 ;
        this.saltando = true;
        this.enSuelo = false;
        let alturaMaxima = this.y - 100;
        const salto = setInterval(() => {
         if (this.y > alturaMaxima) {
             this.y -= 10;
        } else {
             clearInterval(salto);
             this.caer();
             this.saltando = false;
         }
        this.actualizarPosicion();  
        }, 20);
	}

	caer() {
    this.saltando = false;
    const gravedad = setInterval(() => {
		if (this.y < 300) {
			this.y += 10;
		} else {
			clearInterval(gravedad);
	    }
	    this.actualizarPosicion();
	    }, 20);
	} 

  actualizarFisicas() {
    this.velocidadSalto += this.gravedad; // Apply gravity
    this.y += this.velocidadSalto;

    const sueloY = 300;
    // Ground collision
    if (this.y >= 300) { // 👈 Replace 400 with your ground Y level
        this.y = 300;
        this.velocidadSalto = 0;
        this.enSuelo = true;
        this.saltando = false;
    } 
 
    this.actualizarPosicion();
    requestAnimationFrame(() => this.actualizarFisicas());
  }

  
	actualizarPosicion() {
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

class Platafromas {
     constructor(){
        this.x = Math.random() * 700 + 50;
        this.y = Math.random() * 250 + 50;
        this.width = 50; 
        this.height = 50;
        this.element = document.createElement("div");
        this.element.classList.add("platforms"); 
        this.actualizarPosicion();

    }
}

const juego = new Game();

personaje.actualizarFisicas();
