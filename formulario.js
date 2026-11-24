const formulario = document.getElementById("formularioAlumno");
const mensaje = document.getElementById("mensaje");

function validarCampos(datos) {
    const nombre = String(datos.nombre || "").trim();
    const apellidos = String(datos.apellidos || "").trim();
    const curp = String(datos.curp || "").trim();
    const telefono = String(datos.telefono || "").trim();
    const correo = String(datos.correo || "").trim();
    const secundaria = String(datos.secundaria || "").trim();
    const especialidad = String(datos.especialidad || "").trim();
    const carrera = String(datos.carrera || "").trim();
    const turno = String(datos.turno || "").trim();
    const sexo = String(datos.sexo || "").trim();
    const fechaNacimiento = String(datos.fechaNacimiento || "").trim();
    const entidadSecundaria = String(datos.entidadSecundaria || "").trim();
    const anioSecundaria = String(datos.anioSecundaria || "").trim();
    const promedioSecundaria = String(datos.promedioSecundaria || "").trim();
    const nombreTutor = String(datos.nombreTutor || "").trim();
    const telefono1 = String(datos.telefono1 || "").trim();
    const telefono2 = String(datos.telefono2 || "").trim();
    const calle = String(datos.calle || "").trim();
    const numero = String(datos.numero || "").trim();
    const colonia = String(datos.colonia || "").trim();
    const codigoPostal = String(datos.codigoPostal || "").trim();
    const delegacionMunicipio = String(datos.delegacionMunicipio || "").trim();
    const entidadFederativa = String(datos.entidadFederativa || "").trim();
    const ciudad = String(datos.ciudad || "").trim();
    const fechaExamen = String(datos.fechaExamen || "").trim();
    const horaExamen = String(datos.horaExamen || "").trim();

    if (!nombre || !apellidos || !curp || !telefono || !correo || !secundaria || !especialidad || !carrera || !turno || !sexo || !fechaNacimiento || !entidadSecundaria || !anioSecundaria || !promedioSecundaria || !nombreTutor || !telefono1 || !telefono2 || !calle || !numero || !colonia || !codigoPostal || !delegacionMunicipio || !entidadFederativa || !ciudad || !fechaExamen || !horaExamen) {
        return "Completa todos los campos.";
    }

    if (correo.indexOf("@") === -1 || correo.indexOf(".") === -1) {
        return "Ingresa un correo válido.";
    }

    if (telefono.length < 10) {
        return "Ingresa un teléfono válido.";
    }

    if (curp.length < 18) {
        return "La CURP debe tener al menos 18 caracteres.";
    }

    if (Number(promedioSecundaria) < 0 || Number(promedioSecundaria) > 10) {
        return "El promedio de secundaria debe estar entre 0 y 10.";
    }

    if (Number(anioSecundaria) < 2000 || Number(anioSecundaria) > 2035) {
        return "El año de secundaria debe estar entre 2000 y 2035.";
    }

    if (telefono1.length < 10 || telefono2.length < 10) {
        return "Los teléfonos deben tener al menos 10 dígitos.";
    }

    if (codigoPostal.length < 5) {
        return "El código postal debe tener al menos 5 dígitos.";
    }

    return "";
}

if (formulario) {
    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();

        const datos = Object.fromEntries(new FormData(formulario).entries());
        const error = validarCampos(datos);

        if (error) {
            mensaje.textContent = error;
            mensaje.style.color = "red";
            return;
        }

        mensaje.textContent = "Guardando registro...";
        mensaje.style.color = "#333";

        try {
            const respuesta = await fetch("/api/alumnos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.mensaje || "No se pudo guardar el registro.");
            }

            mensaje.textContent = resultado.mensaje || "Registro guardado correctamente.";
            mensaje.style.color = "green";
            formulario.reset();
        } catch (error) {
            mensaje.textContent = error.message || "No se pudo guardar el registro.";
            mensaje.style.color = "red";
        }
    });
}
