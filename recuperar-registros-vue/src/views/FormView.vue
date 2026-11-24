<template>
  <div>
    <h1>Registro de Preinscripción</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="nombre">Nombre:</label>
        <input type="text" v-model="formData.nombre" required />
      </div>
      <div>
        <label for="apellidos">Apellidos:</label>
        <input type="text" v-model="formData.apellidos" required />
      </div>
      <div>
        <label for="curp">CURP:</label>
        <input type="text" v-model="formData.curp" required />
      </div>
      <div>
        <label for="telefono">Teléfono:</label>
        <input type="tel" v-model="formData.telefono" required />
      </div>
      <div>
        <label for="correo">Correo:</label>
        <input type="email" v-model="formData.correo" required />
      </div>
      <div>
        <label for="secundaria">Secundaria:</label>
        <input type="text" v-model="formData.secundaria" required />
      </div>
      <div>
        <label for="especialidad">Especialidad:</label>
        <input type="text" v-model="formData.especialidad" required />
      </div>
      <div>
        <label for="carrera">Carrera:</label>
        <input type="text" v-model="formData.carrera" required />
      </div>
      <div>
        <label for="turno">Turno:</label>
        <input type="text" v-model="formData.turno" required />
      </div>
      <div>
        <label for="sexo">Sexo:</label>
        <select v-model="formData.sexo" required>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>
      </div>
      <div>
        <label for="fechaNacimiento">Fecha de Nacimiento:</label>
        <input type="date" v-model="formData.fechaNacimiento" required />
      </div>
      <div>
        <label for="entidadSecundaria">Entidad de la Secundaria:</label>
        <input type="text" v-model="formData.entidadSecundaria" required />
      </div>
      <div>
        <label for="anioConclusion">Año de Conclusión:</label>
        <input type="number" v-model="formData.anioConclusion" required />
      </div>
      <div>
        <label for="promedioSecundaria">Promedio de Secundaria:</label>
        <input type="number" v-model="formData.promedioSecundaria" required />
      </div>
      <div>
        <label for="nombreTutor">Nombre del Tutor:</label>
        <input type="text" v-model="formData.nombreTutor" required />
      </div>
      <div>
        <label for="telefono1">Teléfono 1:</label>
        <input type="tel" v-model="formData.telefono1" required />
      </div>
      <div>
        <label for="telefono2">Teléfono 2:</label>
        <input type="tel" v-model="formData.telefono2" />
      </div>
      <div>
        <label for="calle">Calle:</label>
        <input type="text" v-model="formData.calle" required />
      </div>
      <div>
        <label for="numero">Número:</label>
        <input type="text" v-model="formData.numero" required />
      </div>
      <div>
        <label for="colonia">Colonia:</label>
        <input type="text" v-model="formData.colonia" required />
      </div>
      <div>
        <label for="codigoPostal">Código Postal:</label>
        <input type="text" v-model="formData.codigoPostal" required />
      </div>
      <div>
        <label for="delegacion">Delegación o Municipio:</label>
        <input type="text" v-model="formData.delegacion" required />
      </div>
      <div>
        <label for="entidadFederativa">Entidad Federativa:</label>
        <input type="text" v-model="formData.entidadFederativa" required />
      </div>
      <div>
        <label for="ciudad">Ciudad:</label>
        <input type="text" v-model="formData.ciudad" required />
      </div>
      <div>
        <label for="fechaExamen">Fecha del Examen:</label>
        <input type="date" v-model="formData.fechaExamen" required />
      </div>
      <div>
        <label for="horaExamen">Hora del Examen:</label>
        <input type="time" v-model="formData.horaExamen" required />
      </div>
      <button type="submit">Registrar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'FormView',
  setup() {
    const formData = ref({
      nombre: '',
      apellidos: '',
      curp: '',
      telefono: '',
      correo: '',
      secundaria: '',
      especialidad: '',
      carrera: '',
      turno: '',
      sexo: '',
      fechaNacimiento: '',
      entidadSecundaria: '',
      anioConclusion: '',
      promedioSecundaria: '',
      nombreTutor: '',
      telefono1: '',
      telefono2: '',
      calle: '',
      numero: '',
      colonia: '',
      codigoPostal: '',
      delegacion: '',
      entidadFederativa: '',
      ciudad: '',
      fechaExamen: '',
      horaExamen: '',
    });

    const submitForm = () => {
      // Handle form submission logic here
      console.log(formData.value);
    };

    return {
      formData,
      submitForm,
    };
  },
});
</script>

<style scoped>
/* Add any specific styles for this component here */
</style>