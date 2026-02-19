<template>
  <div class="top-bar">
    <h1 class="app-title">Diseñador de Interiores</h1>
    <button class="clear-button" @click="clearAll">Limpiar Todo</button>
  </div>
</template>

<script setup>
import { useFurnitureStore } from '../stores/furnitureStore'

const furnitureStore = useFurnitureStore()

const clearAll = () => {
  if (confirm('¿Estás seguro de borrar todos los muebles?')) {
    furnitureStore.clearAll()
  }
}
</script>

<style scoped>
.top-bar {
  height: 60px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 24px;
  font-weight: 600;
}

.clear-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.clear-button:hover {
  background-color: #c0392b;
}
</style>
