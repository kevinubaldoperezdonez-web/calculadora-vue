const tabla = document.getElementById("tabla");
const busqueda = document.getElementById("busqueda");
const mensaje = document.getElementById("mensaje");

function renderizar(alumnos) {
    if (!tabla) return;

    tabla.innerHTML = "";

    if (!alumnos.length) {
        tabla.innerHTML = '<tr><td colspan="16">no hay registros</td></tr>';
        return;
    }

    alumnos.forEach((alumno) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${alumno.nombre || "-"}</td>
            <td>${alumno.apellidos || "-"}</td>
            <td>${alumno.curp || "-"}</td>
            <td>${alumno.telefono || "-"}</td>
            <td>${alumno.correo || "-"}</td>
            <td>${alumno.secundaria || "-"}</td>
            <td>${alumno.especialidad || "-"}</td>
            <td>${alumno.carrera || "-"}</td>
            <td>${alumno.turno || "-"}</td>
            <td>${alumno.sexo || "-"}</td>
            <td>${alumno.fechaNacimiento || "-"}</td>
            <td>${alumno.entidadSecundaria || "-"}</td>
            <td>${alumno.anioSecundaria || "-"}</td>
            <td>${alumno.promedioSecundaria || "-"}</td>
            <td>${alumno.nombreTutor || "-"}</td>
            <td>${alumno.telefono1 || "-"}</td>
            <td>${alumno.telefono2 || "-"}</td>
            <td>${alumno.calle || "-"}</td>
            <td>${alumno.numero || "-"}</td>
            <td>${alumno.colonia || "-"}</td>
            <td>${alumno.codigoPostal || "-"}</td>
            <td>${alumno.delegacionMunicipio || "-"}</td>
            <td>${alumno.entidadFederativa || "-"}</td>
            <td>${alumno.ciudad || "-"}</td>
            <td>${alumno.fechaExamen || "-"}</td>
            <td>${alumno.horaExamen || "-"}</td>
        `;
        tabla.appendChild(fila);
    });
}

async function cargarAlumnos() {
    try {
        const respuesta = await fetch("/api/alumnos");
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || "error al obtener registros");
        }

        renderizar(datos);
        mensaje.textContent = `se encontraron ${datos.length} registros`;
        mensaje.style.color = "#333";
    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.style.color = "red";
        renderizar([]);
    }
}

if (busqueda) {
    busqueda.addEventListener("input", async () => {
        try {
            const respuesta = await fetch("/api/alumnos");
            const alumnos = await respuesta.json();
            const texto = busqueda.value.trim().toLowerCase();

            const filtrados = !texto
                ? alumnos
                : alumnos.filter((alumno) => {
                    const nombre = (alumno.nombre || "").toLowerCase();
                    const curp = (alumno.curp || "").toLowerCase();
                    return nombre.includes(texto) || curp.includes(texto);
                });

            renderizar(filtrados);
        } catch (error) {
            mensaje.textContent = "no se pudo filtrar la búsqueda";
            mensaje.style.color = "red";
        }
    });
}

cargarAlumnos();
