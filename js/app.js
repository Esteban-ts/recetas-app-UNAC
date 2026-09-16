
let favoritos = [];


document.addEventListener("DOMContentLoaded", inicializar);

function inicializar() {
  configurarNavbar();
  configurarBusqueda();
  configurarLogin();
  renderizarRecetas();
  renderizarFavoritos();
  cambiarPagina("home");
}


function configurarNavbar() {
  const logo = document.getElementById("logo");
  logo.addEventListener("click", () => cambiarPagina("home"));

  const links = document.querySelectorAll(".navbar-links li");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      cambiarPagina(link.dataset.pagina);
    });
  });
}

function cambiarPagina(pagina) {
 
  document.querySelectorAll(".pagina").forEach((sec) => sec.classList.remove("active"));
  document.querySelectorAll(".navbar-links li").forEach((li) => li.classList.remove("active"));


  switch (pagina) {
    case "home":
      document.getElementById("pagina-home").classList.add("active");
      break;
    case "recetas":
      document.getElementById("pagina-recetas").classList.add("active");
      break;
    case "detalle":
      document.getElementById("pagina-detalle").classList.add("active");
      break;
    case "login":
      document.getElementById("pagina-login").classList.add("active");
      break;
    case "favoritos":
      document.getElementById("pagina-favoritos").classList.add("active");
      break;
    default:
      document.getElementById("pagina-home").classList.add("active");
  }

  const linkActivo = document.querySelector(`.navbar-links li[data-pagina="${pagina}"]`);
  if (linkActivo) linkActivo.classList.add("active");
}


function configurarBusqueda() {
  const form = document.getElementById("form-busqueda");

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const texto = document.getElementById("input-busqueda").value.trim();

    if (texto) {
      cambiarPagina("recetas");
    } else {
      alert("Escribe un ingrediente o platillo para buscar");
    }
  });
}


function renderizarRecetas() {
  const grid = document.getElementById("grid-recetas");
  grid.innerHTML = "";

  recetas.forEach((receta) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-receta";

    const badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = receta.dificultad;

    const titulo = document.createElement("h3");
    titulo.textContent = receta.nombre;

    const tiempo = document.createElement("p");
    tiempo.textContent = `⏱️ ${receta.tiempo}`;

    const boton = document.createElement("button");
    boton.className = "btn-primary";
    boton.textContent = "Ver Receta Completa";
    boton.addEventListener("click", (e) => {
      e.stopPropagation();
      mostrarDetalle(receta.id);
    });

    tarjeta.appendChild(badge);
    tarjeta.appendChild(titulo);
    tarjeta.appendChild(tiempo);
    tarjeta.appendChild(boton);

    // También se puede hacer clic en toda la tarjeta
    tarjeta.addEventListener("click", () => mostrarDetalle(receta.id));

    grid.appendChild(tarjeta);
  });
}


function mostrarDetalle(id) {
  const receta = recetas.find((r) => r.id === id);
  if (!receta) return;

  const contenedor = document.getElementById("detalle-card");
  contenedor.innerHTML = "";

  const btnVolver = document.createElement("button");
  btnVolver.className = "btn-volver";
  btnVolver.textContent = "← Volver";
  btnVolver.addEventListener("click", () => cambiarPagina("recetas"));

  const titulo = document.createElement("h1");
  titulo.textContent = receta.nombre;

  const accionesBar = document.createElement("div");
  accionesBar.className = "acciones-bar";

  const btnCopiar = document.createElement("button");
  btnCopiar.textContent = "📋 Copiar Ingredientes";
  btnCopiar.addEventListener("click", () => copiarIngredientes(receta));

  const btnImprimir = document.createElement("button");
  btnImprimir.textContent = "🖨️ Imprimir Receta";
  btnImprimir.addEventListener("click", () => window.print());

  const btnFavorito = document.createElement("button");
  actualizarTextoFavorito(btnFavorito, receta.id);
  btnFavorito.addEventListener("click", () => {
    alternarFavorito(receta.id);
    actualizarTextoFavorito(btnFavorito, receta.id);
  });

  accionesBar.appendChild(btnCopiar);
  accionesBar.appendChild(btnImprimir);
  accionesBar.appendChild(btnFavorito);

  const seccionIngredientes = document.createElement("div");
  seccionIngredientes.className = "seccion";
  const h3Ing = document.createElement("h3");
  h3Ing.textContent = "Ingredientes:";
  const listaIng = document.createElement("ul");
  receta.ingredientes.forEach((ing) => {
    const li = document.createElement("li");
    li.textContent = ing;
    listaIng.appendChild(li);
  });
  seccionIngredientes.appendChild(h3Ing);
  seccionIngredientes.appendChild(listaIng);

  const seccionPasos = document.createElement("div");
  seccionPasos.className = "seccion";
  const h3Pasos = document.createElement("h3");
  h3Pasos.textContent = "Preparación paso a paso:";
  const listaPasos = document.createElement("ol");
  receta.pasos.forEach((paso) => {
    const li = document.createElement("li");
    li.textContent = paso;
    listaPasos.appendChild(li);
  });
  seccionPasos.appendChild(h3Pasos);
  seccionPasos.appendChild(listaPasos);

  contenedor.appendChild(btnVolver);
  contenedor.appendChild(titulo);
  contenedor.appendChild(accionesBar);
  contenedor.appendChild(seccionIngredientes);
  contenedor.appendChild(seccionPasos);

  cambiarPagina("detalle");
}

function actualizarTextoFavorito(boton, id) {
  boton.textContent = favoritos.includes(id) ? "💔 Quitar de Favoritos" : "❤️ Guardar en Favoritos";
}

function copiarIngredientes(receta) {
  navigator.clipboard
    .writeText(receta.ingredientes.join("\n"))
    .then(() => alert("¡Ingredientes copiados al portapapeles!"))
    .catch(() => alert("No se pudo copiar. Intenta de nuevo."));
}


function alternarFavorito(id) {
  const index = favoritos.indexOf(id);

  if (index === -1) {
    favoritos.push(id); 
  } else {
    favoritos.splice(index, 1); 
  }

  renderizarFavoritos();
}

function renderizarFavoritos() {
  const contenedor = document.getElementById("lista-favoritos");
  contenedor.innerHTML = "";

  if (favoritos.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "Aún no has guardado ninguna receta. ¡Explora el catálogo y guarda tus preferidas!";
    contenedor.appendChild(mensaje);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "grid-recetas";

  favoritos.forEach((id) => {
    const receta = recetas.find((r) => r.id === id);
    if (!receta) return;

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-receta";
    tarjeta.addEventListener("click", () => mostrarDetalle(receta.id));

    const titulo = document.createElement("h3");
    titulo.textContent = receta.nombre;

    tarjeta.appendChild(titulo);
    grid.appendChild(tarjeta);
  });

  contenedor.appendChild(grid);
}


function configurarLogin() {
  const form = document.getElementById("form-login");
  const inputEmail = document.getElementById("email");
  const inputPassword = document.getElementById("password");

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    let esValido = true;

    if (inputEmail.value.includes("@")) {
      inputEmail.classList.remove("invalido");
      inputEmail.classList.add("valido");
    } else {
      inputEmail.classList.remove("valido");
      inputEmail.classList.add("invalido");
      esValido = false;
    }

    if (inputPassword.value.length >= 6) {
      inputPassword.classList.remove("invalido");
      inputPassword.classList.add("valido");
    } else {
      inputPassword.classList.remove("valido");
      inputPassword.classList.add("invalido");
      esValido = false;
    }

    if (esValido) {
      alert(`Bienvenido de nuevo: ${inputEmail.value}`);
    } else {
      alert("Revisa los campos marcados en rojo antes de continuar.");
    }
  });
}
