let evaluaciones = [];

const filtroEspecialidad = document.getElementById("filtro-especialidad");
const filtroSemestre = document.getElementById("filtro-semestre");
const filtroDocente = document.getElementById("filtro-docente");
const contenedor = document.getElementById("contenedor-resultados");

function escaparHTML(texto) {
  const elemento = document.createElement("div");
  elemento.textContent = texto ?? "";
  return elemento.innerHTML;
}

async function cargarResultados() {
  try {
    const respuesta = await fetch("/api/evaluaciones");
    if (!respuesta.ok) throw new Error("No se pudieron cargar los resultados");
    evaluaciones = await respuesta.json();
    actualizarFiltroDocentes();
    renderResultados();
  } catch (error) {
    mostrarToast(error.message);
  }
}

function actualizarFiltroDocentes() {
  const valorActual = filtroDocente.value;
  const nombres = [...new Map(
    evaluaciones.map(ev => [ev.docenteId || ev.docenteNombre, ev.docenteNombre])
  ).entries()].sort((a, b) => a[1].localeCompare(b[1], "es"));

  filtroDocente.innerHTML = '<option value="TODOS">Todos los docentes</option>';
  nombres.forEach(([id, nombre]) => {
    const opcion = document.createElement("option");
    opcion.value = id;
    opcion.textContent = nombre;
    filtroDocente.appendChild(opcion);
  });

  if ([...filtroDocente.options].some(opcion => opcion.value === valorActual)) {
    filtroDocente.value = valorActual;
  }
}

function renderResultados() {
  const especialidad = filtroEspecialidad.value;
  const semestre = filtroSemestre.value;
  const docente = filtroDocente.value;

  const filtradas = evaluaciones.filter(ev =>
    (especialidad === "TODAS" || ev.especialidad === especialidad) &&
    (semestre === "TODOS" || ev.semestre === semestre) &&
    (docente === "TODOS" || (ev.docenteId || ev.docenteNombre) === docente)
  );

  document.getElementById("total-evaluaciones").textContent =
    `${filtradas.length} respuesta(s) encontrada(s)`;

  if (filtradas.length === 0) {
    contenedor.innerHTML = '<p class="subtitle">No hay evaluaciones con los filtros seleccionados.</p>';
    return;
  }

  const nombresPreguntas = [
    "Dominio y actualización",
    "Claridad y didáctica",
    "Puntualidad y tiempo",
    "Participación y dudas",
    "Evaluación clara y justa",
    "Trato respetuoso"
  ];
  const nombresOpciones = ["Deficiente", "Regular", "Bueno", "Excelente"];

  const grupos = {};
  filtradas.forEach(ev => {
    const clave = ev.submissionId || ev.id;
    if (!grupos[clave]) grupos[clave] = [];
    grupos[clave].push(ev);
  });

  const gruposOrdenados = Object.values(grupos).sort((a, b) =>
    new Date(b[0].fecha) - new Date(a[0].fecha)
  );

  contenedor.innerHTML = "";
  gruposOrdenados.forEach((grupo, indiceGrupo) => {
    const ultimoEnvio = grupo
      .map(ev => ev.fecha)
      .sort((a, b) => new Date(b) - new Date(a))[0];

    const tarjeta = document.createElement("article");
    tarjeta.className = "resultado-card";
    tarjeta.innerHTML = `
      <div class="resultado-top">
        <div>
          <strong>Persona ${gruposOrdenados.length - indiceGrupo}</strong>
          <div style="font-size:.8rem;color:var(--text-muted)">
            ${grupo.length} docente(s) evaluado(s)
            <br>${escaparHTML(new Date(ultimoEnvio).toLocaleString("es-MX"))}
          </div>
        </div>
      </div>
    `;

    grupo.forEach(ev => {
      const respuestas = ev.respuestas.map((valor, i) => `
        <div style="padding:.55rem;border:1px solid var(--border);border-radius:8px;">
          <span style="display:block;font-size:.78rem;color:var(--text-muted)">${i + 1}. ${nombresPreguntas[i]}</span>
          <strong>${nombresOpciones[valor - 1]} (${valor}/4)</strong>
        </div>
      `).join("");

      const evaluacion = document.createElement("div");
      evaluacion.style.cssText = "border-top:1px solid var(--border);margin-top:.75rem;padding-top:.75rem";
      evaluacion.innerHTML = `
        <div class="resultado-top">
          <div>
            <strong>${escaparHTML(ev.docenteNombre)}</strong>
            <span style="color:var(--text-muted)"> — ${escaparHTML(ev.materia)}</span>
            <div style="font-size:.8rem;color:var(--text-muted)">
              ${escaparHTML(ev.especialidad)} • ${escaparHTML(ev.semestre)}° Semestre
            </div>
          </div>
          <div class="score-pill">${Number(ev.promedio).toFixed(2)} / 4.00</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.6rem">
          ${respuestas}
        </div>
        ${ev.comentario ? `<div class="comentarios-lista"><strong>Comentario anónimo:</strong><div class="comentario-item">“${escaparHTML(ev.comentario)}”</div></div>` : ""}
        <div style="display:flex;justify-content:flex-end;margin-top:.75rem">
          <button type="button" class="btn-danger-outline btn-eliminar-evaluacion" data-id="${escaparHTML(ev.id)}">
            Eliminar esta respuesta
          </button>
        </div>
      `;
      tarjeta.appendChild(evaluacion);
    });

    contenedor.appendChild(tarjeta);
  });

  document.querySelectorAll(".btn-eliminar-evaluacion").forEach(boton => {
    boton.addEventListener("click", async () => {
      if (!confirm("¿Eliminar únicamente esta respuesta? Esta acción no se puede deshacer.")) return;
      try {
        const respuesta = await fetch(`/api/evaluaciones/${encodeURIComponent(boton.dataset.id)}`, { method: "DELETE" });
        const resultado = await respuesta.json();
        if (!respuesta.ok) throw new Error(resultado.mensaje);
        evaluaciones = evaluaciones.filter(ev => ev.id !== boton.dataset.id);
        actualizarFiltroDocentes();
        renderResultados();
        mostrarToast("Respuesta individual eliminada.");
      } catch (error) {
        mostrarToast(error.message || "No se pudo eliminar la respuesta.");
      }
    });
  });
}

filtroEspecialidad.addEventListener("change", renderResultados);
filtroSemestre.addEventListener("change", renderResultados);
filtroDocente.addEventListener("change", renderResultados);

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3200);
}

cargarResultados();
