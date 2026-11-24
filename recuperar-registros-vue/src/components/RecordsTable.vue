<template>
  <div>
    <h2>Alumnos Registrados</h2>
    <input type="search" v-model="searchQuery" placeholder="Buscar por nombre o CURP" />
    <div class="tabla">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>CURP</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Secundaria</th>
            <th>Especialidad</th>
            <th>Carrera</th>
            <th>Turno</th>
            <th>Sexo</th>
            <th>Fecha de Nacimiento</th>
            <th>Entidad de la Secundaria</th>
            <th>Año de Conclusión</th>
            <th>Promedio de Secundaria</th>
            <th>Nombre del Tutor</th>
            <th>Teléfono 1</th>
            <th>Teléfono 2</th>
            <th>Calle</th>
            <th>Número</th>
            <th>Colonia</th>
            <th>Código Postal</th>
            <th>Delegación o Municipio</th>
            <th>Entidad Federativa</th>
            <th>Ciudad</th>
            <th>Fecha del Examen</th>
            <th>Hora del Examen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredRecords" :key="record.curp">
            <td>{{ record.nombre }}</td>
            <td>{{ record.apellidos }}</td>
            <td>{{ record.curp }}</td>
            <td>{{ record.telefono }}</td>
            <td>{{ record.correo }}</td>
            <td>{{ record.secundaria }}</td>
            <td>{{ record.especialidad }}</td>
            <td>{{ record.carrera }}</td>
            <td>{{ record.turno }}</td>
            <td>{{ record.sexo }}</td>
            <td>{{ record.fechaNacimiento }}</td>
            <td>{{ record.entidadSecundaria }}</td>
            <td>{{ record.anioConclusion }}</td>
            <td>{{ record.promedioSecundaria }}</td>
            <td>{{ record.nombreTutor }}</td>
            <td>{{ record.telefono1 }}</td>
            <td>{{ record.telefono2 }}</td>
            <td>{{ record.calle }}</td>
            <td>{{ record.numero }}</td>
            <td>{{ record.colonia }}</td>
            <td>{{ record.codigoPostal }}</td>
            <td>{{ record.delegacionMunicipio }}</td>
            <td>{{ record.entidadFederativa }}</td>
            <td>{{ record.ciudad }}</td>
            <td>{{ record.fechaExamen }}</td>
            <td>{{ record.horaExamen }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="filteredRecords.length === 0" id="mensaje">No se encontraron registros.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'RecordsTable',
  setup() {
    const searchQuery = ref('');
    const records = ref<any[]>([]); // Replace 'any' with your record type

    // Fetch records from an API or data source
    const fetchRecords = async () => {
      // Simulated fetch, replace with actual API call
      records.value = await fetch('/api/records').then(res => res.json());
    };

    const filteredRecords = computed(() => {
      return records.value.filter(record => {
        return (
          record.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          record.curp.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      });
    });

    fetchRecords();

    return {
      searchQuery,
      filteredRecords,
    };
  },
});
</script>

<style scoped>
/* Add any specific styles for the RecordsTable component here */
</style>