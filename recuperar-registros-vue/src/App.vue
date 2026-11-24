<template>
  <div id="app">
    <header>
      <h1>Registros de Preinscripción</h1>
    </header>
    <nav>
      <router-link to="/form">Formulario</router-link>
      <router-link to="/records">Consultar Registros</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'App'
}
</script>

<style>
/* Global styles can be added here */
</style>