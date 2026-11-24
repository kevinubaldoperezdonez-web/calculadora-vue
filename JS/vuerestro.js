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
                this.alumnos = []
                this.error = true
                this.mensaje = error.message
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

                const resultado = await respuesta.json()

                if (!respuesta.ok) {
                    throw new Error(resultado.mensaje || "No se pudo guardar el registro")
                }

                this.mensajeRegistro = resultado.mensaje || "Registro guardado correctamente"
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
                await this.cargarAlumnos()
            } catch (error) {
                this.error = true
                this.mensajeRegistro = error.message
            }
        },
    },

    mounted() {
        this.cargarAlumnos()
    }
})

app.mount("#app")
