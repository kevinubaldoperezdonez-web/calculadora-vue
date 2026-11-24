const app = Vue.createApp({
    data() {
        return {
            alumnos: [],
            busqueda: "",
            mensaje: "Cargando registros...",
            mensajeRegistro: "",
            error: false,
            nuevoAlumno: {
                nombre: "",
                apellidos: "",
                curp: "",
                telefono: "",
                correo: "",
                secundaria: "",
                especialidad: "",
                carrera: "",
                turno: "",
                sexo: "",
                fechaNacimiento: "",
                entidadSecundaria: "",
                anioSecundaria: "",
                promedioSecundaria: "",
                nombreTutor: "",
                telefono1: "",
                telefono2: "",
                calle: "",
                numero: "",
                colonia: "",
                codigoPostal: "",
                delegacionMunicipio: "",
                entidadFederativa: "",
                ciudad: "",
                fechaExamen: "",
                horaExamen: ""
            }
        }
    },

    computed: {
        alumnosFiltrados() {
            const texto = this.busqueda.trim().toLowerCase()

            if (!texto) {
                return this.alumnos
            }

            return this.alumnos.filter((alumno) => {
                const nombre = (alumno.nombre || "").toLowerCase()
                const apellidos = (alumno.apellidos || "").toLowerCase()
                const curp = (alumno.curp || "").toLowerCase()

                return nombre.includes(texto)
                    || apellidos.includes(texto)
                    || curp.includes(texto)
            })
        }
    },

    methods: {
        async cargarAlumnos() {
            this.error = false

            try {
                const respuesta = await fetch("/api/alumnos")
                const datos = await respuesta.json()

                if (!respuesta.ok) {
                    throw new Error(datos.mensaje || "Error al obtener registros")
                }

                this.alumnos = datos
                this.mensaje = `Se encontraron ${datos.length} registros`
            } catch (error) {
                const registrosLocales = JSON.parse(localStorage.getItem("alumnosRegistroVue") || "[]")
                this.alumnos = registrosLocales
                this.error = false
                this.mensaje = registrosLocales.length
                    ? `Se encontraron ${registrosLocales.length} registros locales`
                    : "No hay registros locales. Usa el formulario para agregar uno."
            }
        },
        async guardarAlumno() {
            this.error = false
            this.mensajeRegistro = "Guardando registro..."

            try {
                const respuesta = await fetch("/api/alumnos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.nuevoAlumno)
                })

                if (respuesta.ok) {
                    const resultado = await respuesta.json()
                    this.mensajeRegistro = resultado.mensaje || "Registro guardado correctamente"
                } else {
                    throw new Error("API no disponible")
                }

                await this.cargarAlumnos()
            } catch (error) {
                const registrosLocales = JSON.parse(localStorage.getItem("alumnosRegistroVue") || "[]")
                const curp = (this.nuevoAlumno.curp || "").trim().toLowerCase()

                if (registrosLocales.some(alumno => (alumno.curp || "").toLowerCase() === curp)) {
                    this.error = true
                    this.mensajeRegistro = "La CURP ya está registrada"
                    return
                }

                registrosLocales.push({ ...this.nuevoAlumno })
                localStorage.setItem("alumnosRegistroVue", JSON.stringify(registrosLocales))
                this.mensajeRegistro = "Registro guardado correctamente en este navegador"
                this.error = false
                await this.cargarAlumnos()
            }

            this.nuevoAlumno = {
                nombre: "",
                apellidos: "",
                curp: "",
                telefono: "",
                correo: "",
                secundaria: "",
                especialidad: "",
                carrera: "",
                turno: "",
                sexo: "",
                fechaNacimiento: "",
                entidadSecundaria: "",
                anioSecundaria: "",
                promedioSecundaria: "",
                nombreTutor: "",
                telefono1: "",
                telefono2: "",
                calle: "",
                numero: "",
                colonia: "",
                codigoPostal: "",
                delegacionMunicipio: "",
                entidadFederativa: "",
                ciudad: "",
                fechaExamen: "",
                horaExamen: ""
            }
        },
    },

    mounted() {
        this.cargarAlumnos()
    }
})

app.mount("#app")
