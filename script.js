const mensajePersonalizado =
  "Para mi Mamá.\n\nCada pétalo de este ramo es un motivo por el que eres especial para mí. Feliz 21 de septiembre. 🌻";

document.addEventListener("DOMContentLoaded", () => {
  generarDestellos();
  configurarReproductor();
  configurarFlorSorpresa();
  configurarModal();
  iniciarPantallaCarga();
});

function iniciarPantallaCarga() {
  const loader = document.getElementById("loaderPantalla");
  const app = document.querySelector(".app");
  const loaderTitulo = document.getElementById("loaderTitulo");
  const loaderCargando = document.getElementById("loaderCargando");

  const petalos = Array.from(
    document.querySelectorAll(".loader-petalo")
  ).sort((a, b) => Number(a.dataset.orden) - Number(b.dataset.orden));

  const inicioPetalos = 500; 
  const separacionPetalos = 320; 
  const duracionPetalo = 900; 

  petalos.forEach((petalo, indice) => {
    setTimeout(() => {
      petalo.classList.add("mostrar");
    }, inicioPetalos + indice * separacionPetalos);
  });

  const finPetalos =
    inicioPetalos + petalos.length * separacionPetalos + duracionPetalo;

  setTimeout(() => {
    loaderTitulo.classList.add("mostrar");
    loaderCargando.classList.add("mostrar");
  }, finPetalos);

  const tiempoDeLectura = 1600;
  const inicioSalida = finPetalos + 600 + tiempoDeLectura;

  setTimeout(() => {
    loader.classList.add("ocultar");
    app.classList.add("mostrar");
  }, inicioSalida);

  setTimeout(() => {
    if (loader) loader.remove();
  }, inicioSalida + 700);
}

function generarDestellos(cantidad = 28) {
  const fondo = document.getElementById("fondoEstrellado");

  for (let i = 0; i < cantidad; i++) {
    const destello = document.createElement("div");
    destello.className = "destello";

    const izquierda = Math.random() * 100;
    const retraso = Math.random() * 12;
    const duracion = 8 + Math.random() * 10;
    const escala = 0.5 + Math.random() * 1.2;

    destello.style.left = `${izquierda}vw`;
    destello.style.bottom = `-10px`;
    destello.style.animationDelay = `${retraso}s`;
    destello.style.animationDuration = `${duracion}s`;
    destello.style.transform = `scale(${escala})`;

    fondo.appendChild(destello);
  }
}

function configurarReproductor() {
  const audio = document.getElementById("audioMusica");
  const btnPlay = document.getElementById("btnPlay");
  const iconoPlay = document.getElementById("iconoPlay");
  const iconoPause = document.getElementById("iconoPause");
  const barraContenedor = document.getElementById("barraContenedor");
  const barraProgreso = document.getElementById("barraProgreso");
  const barraPunto = document.getElementById("barraPunto");
  const tiempoActualEl = document.getElementById("tiempoActual");
  const tiempoTotalEl = document.getElementById("tiempoTotal");

  if (!audio || !btnPlay) return;

  function formatearTiempo(segundos) {
    if (!isFinite(segundos) || isNaN(segundos)) return "0:00";
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60)
      .toString()
      .padStart(2, "0");
    return `${min}:${seg}`;
  }

  audio.addEventListener("loadedmetadata", () => {
    tiempoTotalEl.textContent = formatearTiempo(audio.duration);
  });

  btnPlay.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {
        console.warn("No se pudo reproducir el audio automáticamente.");
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    iconoPlay.classList.add("oculto");
    iconoPause.classList.remove("oculto");
  });

  audio.addEventListener("pause", () => {
    iconoPlay.classList.remove("oculto");
    iconoPause.classList.add("oculto");
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const porcentaje = (audio.currentTime / audio.duration) * 100;
    barraProgreso.style.width = `${porcentaje}%`;
    barraPunto.style.left = `${porcentaje}%`;
    tiempoActualEl.textContent = formatearTiempo(audio.currentTime);
  });

  audio.addEventListener("ended", () => {
    barraProgreso.style.width = "0%";
    barraPunto.style.left = "0%";
    tiempoActualEl.textContent = "0:00";
  });

  barraContenedor.addEventListener("click", (evento) => {
    if (!audio.duration) return;
    const rect = barraContenedor.getBoundingClientRect();
    const porcentajeClic = (evento.clientX - rect.left) / rect.width;
    audio.currentTime = porcentajeClic * audio.duration;
  });
}

function configurarFlorSorpresa() {
  const florSorpresa = document.getElementById("florSorpresa");
  if (!florSorpresa) return;
  florSorpresa.addEventListener("click", abrirModal);
  florSorpresa.setAttribute("tabindex", "0");
  florSorpresa.setAttribute("role", "button");
  florSorpresa.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      abrirModal();
    }
  });
}

function configurarModal() {
  const modalOverlay = document.getElementById("modalOverlay");
  const modalCerrar = document.getElementById("modalCerrar");
  const modalMensaje = document.getElementById("modalMensaje");

  if (!modalOverlay || !modalCerrar || !modalMensaje) return;

  modalMensaje.textContent = mensajePersonalizado;
  modalCerrar.addEventListener("click", cerrarModal);

  modalOverlay.addEventListener("click", (evento) => {
    if (evento.target === modalOverlay) {
      cerrarModal();
    }
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !modalOverlay.classList.contains("oculto")) {
      cerrarModal();
    }
  });
}

function abrirModal() {
  const modal = document.getElementById("modalOverlay");
  if (modal) modal.classList.remove("oculto");
}

function cerrarModal() {
  const modal = document.getElementById("modalOverlay");
  if (modal) modal.classList.add("oculto");
}