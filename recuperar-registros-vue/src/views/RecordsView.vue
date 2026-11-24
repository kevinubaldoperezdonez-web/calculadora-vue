<template>
  <div>
    <header>
      <h1>Registros de Preinscripción</h1>
    </header>
    <nav>
      <router-link to="/form">Formulario</router-link>
      <router-link to="/records">Consultar Registros</router-link>
    </nav>
    <main>
      <h2>Alumnos Registrados</h2>
      <input type="search" v-model="searchQuery" placeholder="Buscar por nombre o CURP" />
      <RecordsTable :searchQuery="searchQuery" />
      <p v-if="message" id="mensaje">{{ message }}</p>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import RecordsTable from '../components/RecordsTable.vue';

export default defineComponent({
  name: 'RecordsView',
  components: {
    RecordsTable,
  },
  setup() {
    const searchQuery = ref('');
    const message = ref('');

    return {
      searchQuery,
      message,
    };
  },
});
</script>

<style scoped>
/* Add any specific styles for RecordsView here */
</style>