<template>
  <div class="sidebar">
    <h2 class="sidebar-title">Muebles</h2>
    <div class="furniture-list">
      <div 
        class="furniture-item" 
        draggable="true"
        @dragstart="handleDragStart($event, 'bed')"
      >
        <div class="furniture-icon">🛏️</div>
        <div class="furniture-name">Cama</div>
      </div>
      
      <div 
        class="furniture-item" 
        draggable="true"
        @dragstart="handleDragStart($event, 'desk')"
      >
        <div class="furniture-icon">🪑</div>
        <div class="furniture-name">Escritorio</div>
      </div>
      
      <div 
        class="furniture-item" 
        draggable="true"
        @dragstart="handleDragStart($event, 'chair')"
      >
        <div class="furniture-icon">🪑</div>
        <div class="furniture-name">Silla</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const handleDragStart = (event, type) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('furniture-type', type)
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: white;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  padding: 20px;
}

.sidebar-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.furniture-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.furniture-item {
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  cursor: grab;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.furniture-item:hover {
  background-color: #e3f2fd;
  border-color: #bbdefb;
  transform: translateY(-2px);
}

.furniture-item:active {
  cursor: grabbing;
}

.furniture-icon {
  font-size: 48px;
}

.furniture-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
</style>
