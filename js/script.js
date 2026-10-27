// 1. Texto animado (dos líneas)
const frases1 = ["QA Tester", "Pruebas manuales y automatizadas", "Testing de APIs y performance"];
const frases2 = ["Café ☕ + bugs 🐞 = buen día", "¿Y si el usuario hace clic dos veces? 🤔", "Calidad no es un paso, es una actitud ✅"];

function animarTexto(elemento, frases) {
  if (!elemento) return; // si no existe el elemento en el HTML, no hace nada
  let iFrase = 0, iLetra = 0, borrando = false;

  function escribir() {
    const actual = Array.from(frases[iFrase]);
    elemento.textContent = actual.slice(0, iLetra).join("");
    if (!borrando && iLetra < actual.length) iLetra++;
    else if (borrando && iLetra > 0) iLetra--;
    else {
      borrando = !borrando;
      if (!borrando) iFrase = (iFrase + 1) % frases.length;
      setTimeout(escribir, 1200);
      return;
    }
    setTimeout(escribir, borrando ? 50 : 90);
  }
  escribir();
}

animarTexto(document.getElementById("textoAnimado1"), frases1);
animarTexto(document.getElementById("textoAnimado2"), frases2);

let iFrase = 0, iLetra = 0, borrando = false;
const texto = document.getElementById("textoAnimado");

// 2. Barras de habilidades se llenan al verlas
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.valor + "%";
      e.target.textContent = e.target.dataset.valor + "%";
      observador.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll(".progress-bar").forEach((b) => observador.observe(b));

// 3. Formulario: valida y abre el correo con el mensaje
// 3. Formulario de contacto: validación al salir de cada campo
const form = document.getElementById("formContacto");
const campoNombre = document.getElementById("nombre");
const campoCorreo = document.getElementById("correo");
const campoMensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador");

// Reglas de cada campo: devuelven "" si está bien, o el mensaje de error
const reglas = {
  nombre: (valor) => {
    if (valor === "") return "El nombre es obligatorio.";
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(valor)) return "El nombre solo puede tener letras y espacios.";
    if (valor.length < 3) return "El nombre debe tener al menos 3 letras.";
    return "";
  },
  correo: (valor) => {
    if (valor === "") return "El correo es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(valor)) return "Escribe un correo válido. Ej: nombre@dominio.com";
    return "";
  },
  mensaje: (valor) => {
    if (valor === "") return "El mensaje es obligatorio.";
    if (valor.length < 20) return `El mensaje debe tener al menos 20 caracteres (llevas ${valor.length}).`;
    return "";
  }
};

const errores = {
  nombre: document.getElementById("errorNombre"),
  correo: document.getElementById("errorCorreo"),
  mensaje: document.getElementById("errorMensaje")
};

// Valida un campo y lo pinta en verde o rojo
function validarCampo(campo) {
  const error = reglas[campo.id](campo.value.trim());
  errores[campo.id].textContent = error;
  campo.classList.toggle("is-invalid", error !== "");
  campo.classList.toggle("is-valid", error === "");
  return error === "";
}

[campoNombre, campoCorreo, campoMensaje].forEach((campo) => {
  // Al salir del campo se valida y queda marcado como "tocado"
  campo.addEventListener("blur", () => {
    campo.dataset.tocado = "true";
    validarCampo(campo);
  });
  // Si ya fue tocado, se revalida mientras escribe
  campo.addEventListener("input", () => {
    if (campo.dataset.tocado) validarCampo(campo);
  });
});

// Contador de caracteres del mensaje
campoMensaje.addEventListener("input", () => {
  contador.textContent = `${campoMensaje.value.length}/500`;
});

// Al enviar se revisan todos los campos
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const campos = [campoNombre, campoCorreo, campoMensaje];
  campos.forEach((c) => (c.dataset.tocado = "true"));
  const todoBien = campos.map(validarCampo).every(Boolean);

  if (!todoBien) {
    form.querySelector(".is-invalid").focus();
    return;
  }

  const asunto = encodeURIComponent("Contacto desde mi portal - " + campoNombre.value.trim());
  const cuerpo = encodeURIComponent(
    campoMensaje.value.trim() + "\n\nDe: " + campoNombre.value.trim() + " (" + campoCorreo.value.trim() + ")"
  );
  window.location.href = `mailto:Lorena99lozano@gmail.com?subject=${asunto}&body=${cuerpo}`;

  const alerta = document.getElementById("alertaExito");
  alerta.classList.remove("d-none");
  form.reset();
  campos.forEach((c) => {
    c.classList.remove("is-valid", "is-invalid");
    delete c.dataset.tocado;
  });
  contador.textContent = "0/500";
  btnEnviar.disabled = true;
  setTimeout(() => alerta.classList.add("d-none"), 4000);

});

// Habilita el botón solo si los 3 campos cumplen las reglas
const btnEnviar = document.getElementById("btnEnviar");

function revisarBoton() {
  const todosValidos = [campoNombre, campoCorreo, campoMensaje]
    .every((campo) => reglas[campo.id](campo.value.trim()) === "");
  btnEnviar.disabled = !todosValidos;
}

[campoNombre, campoCorreo, campoMensaje].forEach((campo) => {
  campo.addEventListener("input", revisarBoton);
});

// 4. Volver arriba + menú activo
const btnArriba = document.getElementById("btnArriba");
const secciones = document.querySelectorAll("section[id]");
const enlaces = document.querySelectorAll(".barra .nav-link");

window.addEventListener("scroll", () => {
  btnArriba.style.display = window.scrollY > 300 ? "block" : "none";
  let actual = "";
  secciones.forEach((s) => { if (window.scrollY >= s.offsetTop - 100) actual = s.id; });
  enlaces.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + actual));
});
btnArriba.addEventListener("click", () => window.scrollTo({ top: 0 }));

// 5. Cerrar menú en celular al elegir opción
enlaces.forEach((a) => a.addEventListener("click", () => {
  const menu = document.getElementById("menu");
  if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
}));

// 6. Año automático
document.getElementById("anio").textContent = new Date().getFullYear();