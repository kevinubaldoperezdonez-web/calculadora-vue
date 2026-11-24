const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const raiz = path.join(__dirname, "..");
const archivoAlumnos = path.join(raiz, "alumnos.json");
const archivoEvaluaciones = path.join(raiz, "evaluaciones.json");

async function leerJSON(archivo, valorInicial = []) {
  try {
    await fs.access(archivo);
    return JSON.parse(await fs.readFile(archivo, "utf8"));
  } catch {
    await fs.writeFile(archivo, JSON.stringify(valorInicial, null, 2));
    return valorInicial;
  }
}

function responder(res, codigo, datos) {
  res.writeHead(codigo, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(datos));
}

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let cuerpo = "";
    req.setEncoding("utf8");
    req.on("data", parte => {
      cuerpo += parte;
      if (cuerpo.length > 100000) {
        reject(new Error("Solicitud demasiado grande"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try { resolve(cuerpo ? JSON.parse(cuerpo) : {}); }
      catch { reject(new Error("JSON inválido")); }
    });
  });
}

function validarEvaluacion(datos) {
  if (!datos.docenteId || !datos.docenteNombre || !datos.materia) return false;
  if (!/^([1-6])$/.test(String(datos.semestre))) return false;
  if (!datos.especialidad || !Array.isArray(datos.respuestas) || datos.respuestas.length !== 6) return false;
  if (datos.submissionId && typeof datos.submissionId !== "string") return false;
  return datos.respuestas.every(valor => Number.isInteger(Number(valor)) && Number(valor) >= 1 && Number(valor) <= 4);
}

const tiposContenido = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml"
};

const servidor = http.createServer(async (req, res) => {
  const ruta = new URL(req.url, "http://localhost").pathname;

  if (req.method === "GET" && ruta === "/api/evaluaciones") {
    try {
      responder(res, 200, await leerJSON(archivoEvaluaciones));
    } catch {
      responder(res, 500, { mensaje: "Error al leer las evaluaciones" });
    }
    return;
  }

  if (req.method === "POST" && ruta === "/api/evaluaciones") {
    try {
      const datos = await leerCuerpo(req);
      if (!validarEvaluacion(datos)) {
        responder(res, 400, { mensaje: "Los datos de la evaluación no son válidos" });
        return;
      }

      const evaluaciones = await leerJSON(archivoEvaluaciones);
      const respuestas = datos.respuestas.map(Number);
      const promedio = respuestas.reduce((total, valor) => total + valor, 0) / respuestas.length;
      const registro = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        docenteId: String(datos.docenteId),
        docenteNombre: String(datos.docenteNombre).slice(0, 100),
        materia: String(datos.materia).slice(0, 150),
        semestre: String(datos.semestre),
        especialidad: String(datos.especialidad).slice(0, 100),
        respuestas,
        promedio: Number(promedio.toFixed(2)),
        comentario: String(datos.comentario || "").trim().slice(0, 1000),
        fecha: new Date().toISOString(),
        submissionId: datos.submissionId ? String(datos.submissionId).slice(0, 100) : null
      };

      evaluaciones.push(registro);
      await fs.writeFile(archivoEvaluaciones, JSON.stringify(evaluaciones, null, 2));
      responder(res, 201, { mensaje: "Evaluación guardada correctamente", evaluacion: registro });
    } catch (error) {
      responder(res, 400, { mensaje: error.message || "No se pudo guardar la evaluación" });
    }
    return;
  }

  if (req.method === "DELETE" && ruta.startsWith("/api/evaluaciones/")) {
    try {
      const id = decodeURIComponent(ruta.slice("/api/evaluaciones/".length));
      const evaluaciones = await leerJSON(archivoEvaluaciones);
      const existentes = evaluaciones.filter(ev => ev.id !== id);

      if (existentes.length === evaluaciones.length) {
        responder(res, 404, { mensaje: "La evaluación no fue encontrada" });
        return;
      }

      await fs.writeFile(archivoEvaluaciones, JSON.stringify(existentes, null, 2));
      responder(res, 200, { mensaje: "Evaluación eliminada individualmente" });
    } catch {
      responder(res, 400, { mensaje: "No se pudo eliminar la evaluación" });
    }
    return;
  }

  if (req.method === "GET" && ruta === "/api/alumnos") {
    try { responder(res, 200, await leerJSON(archivoAlumnos)); }
    catch { responder(res, 500, { mensaje: "Error al leer los registros" }); }
    return;
  }

  if (req.method === "POST" && ruta === "/api/alumnos") {
    try {
      const datos = await leerCuerpo(req);
      const alumnos = await leerJSON(archivoAlumnos);
      if (alumnos.some(a => a.curp && String(datos.curp).toLowerCase() === String(a.curp).toLowerCase())) {
        responder(res, 409, { mensaje: "La CURP ya está registrada" });
        return;
      }
      alumnos.push(datos);
      await fs.writeFile(archivoAlumnos, JSON.stringify(alumnos, null, 2));
      responder(res, 201, { mensaje: "Registro guardado correctamente" });
    } catch (error) {
      responder(res, 400, { mensaje: error.message || "No se pudo guardar el registro" });
    }
    return;
  }

  if (req.method === "GET") {
    const rutaSolicitada = ruta === "/" ? "/pagina.html" : ruta;
    const rutaSegura = path.normalize(rutaSolicitada).replace(/^([.][.][/\\])+/, "");
    const archivo = path.join(raiz, rutaSegura);

    if (!archivo.startsWith(raiz)) {
      responder(res, 403, { mensaje: "Acceso denegado" });
      return;
    }

    try {
      const contenido = await fs.readFile(archivo);
      const extension = path.extname(archivo).toLowerCase();
      res.writeHead(200, { "Content-Type": tiposContenido[extension] || "application/octet-stream", "Cache-Control": "no-cache" });
      res.end(contenido);
    } catch {
      responder(res, 404, { mensaje: "Archivo no encontrado" });
    }
    return;
  }

  responder(res, 405, { mensaje: "Método no permitido" });
});

const puerto = process.env.PORT || 3000;

servidor.listen(puerto, "0.0.0.0", () => {
  console.log(`Servidor disponible en http://localhost:${puerto}/pagina.html`);
});