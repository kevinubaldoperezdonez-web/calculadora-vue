// Catálogo global de docentes (nivel medio superior: disponibles para cualquier especialidad y semestre)
let CATALOGO_DOCENTES = [
  { id: "doc-1", nombre: "Dra. Laura Méndez", materia: "Metodología de la Investigación" },
  { id: "doc-2", nombre: "Ing. Alejandro Soto", materia: "Cómputo y Programación Básica" },
  { id: "doc-3", nombre: "C.P. Roberto Silva", materia: "Administración y Economía" },
  { id: "doc-4", nombre: "Mtra. Sofía Torres", materia: "Ética y Valores" },
  { id: "doc-5", nombre: "Ing. Jorge Domínguez", materia: "Física y Matemáticas" },
  { id: "doc-6", nombre: "Lic. Mariana Castro", materia: "Desarrollo Humano" }
];

// Preguntas de opción múltiple para la evaluación
const PREGUNTAS = [
  "1. Dominio y actualización de los temas de la asignatura",
  "2. Claridad y didáctica al explicar conceptos complejos",
  "3. Puntualidad y aprovechamiento del tiempo de clase",
  "4. Fomento de la participación y resolución de dudas",
  "5. Criterios de evaluación claros, justos y objetivos",
  "6. Trato respetuoso e inclusivo hacia el grupo"
];

const OPCIONES = [
  { texto: "Excelente", valor: 4 },
  { texto: "Bueno", valor: 3 },
  { texto: "Regular", valor: 2 },
  { texto: "Deficiente", valor: 1 }
];

// Estado de la aplicación (estrictamente anónimo, sin datos del alumno)
let docenteSeleccionado = null;
let evaluadosEnSesion = new Set();
let evaluacionesGuardadas = [];

const ID_SESION_ANONIMA = (() => {
  const clave = "evaluacion_sesion_anonima";
  let id = sessionStorage.getItem(clave);
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
    sessionStorage.setItem(clave, id);
  }
  return id;
})();

// Referencias al DOM
const selectSemestre = document.getElementById("semestre");
const selectEspecialidad = document.getElementById("especialidad");
const panelDocentes = document.getElementById("panel-docentes");
const listaDocentes = document.getElementById("lista-docentes");
const formCuestionario = document.getElementById("form-cuestionario");
const preguntasContainer = document.getElementById("preguntas-container");

// Escuchar cambios en Semestre y Especialidad (para habilitar la evaluación)
selectSemestre.addEventListener("change", verificarContexto);
selectEspecialidad.addEventListener("change", verificarContexto);

function verificarContexto() {
  const sem = selectSemestre.value;
  const esp = selectEspecialidad.value;

  if (sem && esp) {
    panelDocentes.classList.remove("hidden");
    formCuestionario.classList.add("hidden");
    renderDocentes();
  } else {
    panelDocentes.classList.add("hidden");
    formCuestionario.classList.add("hidden");
  }
}

// Renderizar la lista global de docentes
function renderDocentes() {
  listaDocentes.innerHTML = "";
  let countEvaluados = 0;

  CATALOGO_DOCENTES.forEach(doc => {
    // Se valida si ya fue evaluado en este semestre específico durante la sesión actual
    const yaEvaluado = evaluadosEnSesion.has(`${selectSemestre.value}-${doc.id}`);
    if (yaEvaluado) countEvaluados++;

    const card = document.createElement("div");
    card.className = `docente-card ${yaEvaluado ? "evaluado" : ""}`;
    card.innerHTML = `
      <div>
        <div class="docente-nombre">${doc.nombre}</div>
        <div class="docente-materia">${doc.materia}</div>
      </div>
      <span class="status-pill ${yaEvaluado ? "status-evaluado" : "status-pendiente"}">
        ${yaEvaluado ? "✓ Evaluado" : "Seleccionar"}
      </span>
    `;
    card.addEventListener("click", () => abrirCuestionario(doc));
    listaDocentes.appendChild(card);
  });

  document.getElementById("progreso-badge").textContent = `${countEvaluados} de ${CATALOGO_DOCENTES.length} evaluados`;
}

// Agregar docente personalizado al catálogo general
document.getElementById("btn-agregar-docente").addEventListener("click", () => {
  const input = document.getElementById("nuevo-docente-nombre");
  const texto = input.value.trim();

  if (!texto) return;

  const nuevoId = "custom-" + Date.now();
  CATALOGO_DOCENTES.push({
    id: nuevoId,
    nombre: texto,
    materia: "Asignatura General / Especialidad"
  });

  input.value = "";
  renderDocentes();
  mostrarToast("Docente agregado al catálogo general.");
});

function abrirCuestionario(docente) {
  docenteSeleccionado = docente;
  document.getElementById("titulo-docente-actual").textContent = `Evaluando a: ${docente.nombre}`;
  document.getElementById("subtitulo-docente-actual").textContent = 
    `${docente.materia} • ${selectEspecialidad.value} (${selectSemestre.value}° Semestre)`;

  preguntasContainer.innerHTML = "";
  PREGUNTAS.forEach((pregunta, index) => {
    const div = document.createElement("div");
    div.className = "pregunta-item";
    
    const opcionesHTML = OPCIONES.map(op => `
      <label class="opcion-label">
        <input type="radio" name="preg_${index}" value="${op.valor}" required>
        <span>${op.texto}</span>
      </label>
    `).join("");

    div.innerHTML = `
      <span class="pregunta-texto">${pregunta}</span>
      <div class="opciones-grid">${opcionesHTML}</div>
    `;
    preguntasContainer.appendChild(div);
  });

  document.getElementById("comentario").value = "";
  formCuestionario.classList.remove("hidden");
  formCuestionario.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("btn-cancelar-eval").addEventListener("click", () => {
  formCuestionario.classList.add("hidden");
  docenteSeleccionado = null;
});

// Guardar evaluación anónima en el servidor
formCuestionario.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!docenteSeleccionado) return;

  const respuestas = [];
  for (let i = 0; i < PREGUNTAS.length; i++) {
    const seleccionada = document.querySelector(`input[name="preg_${i}"]:checked`);
    if (seleccionada) respuestas.push(Number(seleccionada.value));
  }

  if (respuestas.length !== PREGUNTAS.length) {
    mostrarToast("Responde todas las preguntas antes de enviar.");
    return;
  }

  const registroAnonimo = {
    submissionId: ID_SESION_ANONIMA,
    docenteId: docenteSeleccionado.id,
    docenteNombre: docenteSeleccionado.nombre,
    materia: docenteSeleccionado.materia,
    semestre: selectSemestre.value,
    especialidad: selectEspecialidad.value,
    respuestas,
    comentario: document.getElementById("comentario").value.trim()
  };

  try {
    const respuesta = await fetch("/api/evaluaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registroAnonimo)
    });

    const resultado = await respuesta.json();
    if (!respuesta.ok) throw new Error(resultado.mensaje);

    evaluacionesGuardadas.push(resultado.evaluacion);
    evaluadosEnSesion.add(`${selectSemestre.value}-${docenteSeleccionado.id}`);

    formCuestionario.classList.add("hidden");
    renderDocentes();
    mostrarToast(`¡Evaluación anónima guardada para ${docenteSeleccionado.nombre}!`);
  } catch (error) {
    mostrarToast(error.message || "No se pudo guardar la evaluación.");
  }
});

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3200);
}