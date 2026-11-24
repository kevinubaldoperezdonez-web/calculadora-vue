const app = Vue.createApp({
    data() {
        return {
            numero1: 10,
            numero2: 20,
            resultado: 30
        }
    },
    methods: {
        sumar() {
            this.resultado = this.numero1 + this.numero2
        },
        restar() {
            this.resultado = this.numero1 - this.numero2
        },
        dividir() {
            this.resultado = this.numero1 / this.numero2
        },
        multiplicar() {
            this.resultado = this.numero1 * this.numero2
        },
        raizCuadrada() {
            this.resultado = Math.sqrt(this.numero1)
        },
        potencia() {
            this.resultado = Math.pow(this.numero1, this.numero2)
        }
    }
})

app.mount("#app")