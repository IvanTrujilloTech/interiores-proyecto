<template>
  <div class="app-container">
    <TopBar />
    <div class="main-content">
      <FurnitureSidebar />
      <RoomScene />
    </div>
  </div>
</template>

<script setup>
import TopBar from './components/TopBar.vue'
import FurnitureSidebar from './components/FurnitureSidebar.vue'
import RoomScene from './components/RoomScene.vue'
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}
</style>
