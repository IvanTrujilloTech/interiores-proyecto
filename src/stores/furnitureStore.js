import { defineStore } from 'pinia'

export const useFurnitureStore = defineStore('furniture', {
  state: () => ({
    items: []
  }),
  
  actions: {
    addFurniture(type, x, y) {
      const newItem = {
        id: Date.now(),
        type,
        x,
        y,
        rotation: 0
      }
      this.items.push(newItem)
    },
    
    removeFurniture(id) {
      const index = this.items.findIndex(item => item.id === id)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
    },
    
    updateFurniturePosition(id, x, y) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        item.x = x
        item.y = y
      }
    },
    
    rotateFurniture(id) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        item.rotation = (item.rotation + 90) % 360
      }
    },
    
    clearAll() {
      this.items = []
    }
  },
  
  getters: {
    totalItems: (state) => state.items.length
  }
})
