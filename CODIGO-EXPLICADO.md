# Proyecto: Diseñador de Interiores 3D - Explicación Detallada del Código

## Descripción del Proyecto

Este proyecto es un **diseñador de interiores 3D interactivo** que permite a los usuarios crear habitaciones virtuales y agregar muebles para visualizar cómo quedaría un espacio antes de realizar cambios reales. La aplicación utiliza tecnologías modernas para proporcionar una experiencia de usuario fluida y realista.

## Tecnologías Utilizadas

### 1. **Framework y Librerías Principales**

- **Vue 3**: Framework JavaScript para la construcción de interfaces de usuario. Utilizado con la sintaxis **Composition API** y **setup script** para una escritura más limpia y modular.
- **TypeScript**: Superconjunto de JavaScript que agrega tipado estático, mejorando la calidad del código y la productividad.
- **Three.js**: Librería 3D para renderizar gráficos en navegador utilizando WebGL. Permite la creación de escenas 3D interactivas.
- **Pinia**: Tienda de estado gestora para Vue 3, simplificando el manejo de datos entre componentes.
- **Vite**: Herramienta de construcción rápida para proyectos Vue, optimizada para el desarrollo moderno.

### 2. **Dependencias del Proyecto**

```json
{
  "dependencies": {
    "pinia": "^2.1.7",        // Gestión de estado
    "three": "^0.160.0",      // Gráficos 3D
    "vue": "^3.4.0",          // Framework principal
    "vue-router": "^4.2.5"    // Navegación entre rutas
  },
  "devDependencies": {
    "@types/three": "^0.182.0",    // Tipos TypeScript para Three.js
    "@vitejs/plugin-vue": "^5.0.2", // Plugin Vite para Vue
    "typescript": "~5.3.3",        // Tipado estático
    "vite": "^5.0.10",             // Herramienta de construcción
    "vue-tsc": "^1.8.27"           // Compilador TypeScript para Vue
  }
}
```

## Estructura del Proyecto

### Archivos Principales

```
src/
├── components/                 # Componentes reutilizables
│   ├── FurnitureSidebar.vue    # Sidebar con muebles drag-and-drop
│   ├── RoomScene.vue           # Escena 3D principal
│   └── TopBar.vue              # Barra superior con título y botón de limpiar
├── stores/                     # Tiendas de estado (Pinia)
│   └── furnitureStore.ts       # Almacena la lista de muebles y acciones
├── views/                      # Vistas de la aplicación
│   └── HomeView.vue            # Vista principal
├── router/                     # Navegación (Vue Router)
│   └── index.ts                # Configuración de rutas
├── App.vue                     # Componente raíz
└── main.ts                     # Punto de entrada de la aplicación
```

## Funcionamiento de la Aplicación - Explicación Paso a Paso

### 1. **Configuración Inicial**

El punto de entrada de la aplicación es [`main.js`](src/main.js), donde se inicializa Vue, Pinia y Vue Router. La aplicación carga la vista principal [`HomeView.vue`](src/views/HomeView.vue), que contiene la estructura básica.

**Código:**
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

### 2. **Componentes Principales**

---

#### a) [`TopBar.vue`](src/components/TopBar.vue)

- **Función**: Muestra el título de la aplicación y un botón para limpiar todos los muebles de la escena.
- **Implementación**:
  - Utiliza el store de Pinia para acceder a la función `clearAll`.
  - Muestra un confirmador antes de borrar todos los muebles.

**Código Clave:**
```vue
<script setup>
import { useFurnitureStore } from '../stores/furnitureStore'

const furnitureStore = useFurnitureStore()

const clearScene = () => {
  if (confirm('¿Estás seguro de que quieres limpiar toda la escena?')) {
    furnitureStore.clearAll()
  }
}
</script>
```

---

#### b) [`FurnitureSidebar.vue`](src/components/FurnitureSidebar.vue)

- **Función**: Permite a los usuarios arrastrar y soltar muebles en la escena 3D.
- **Implementación**:
  - Define items de mueble como elementos HTML5 draggable.
  - Al iniciar el arrastre, guarda el tipo de mueble en el `dataTransfer` del evento.
  - Incluye estilos para indicar el estado hover y active.

**Código Clave - Drag and Drop:**
```vue
<script setup>
const handleDragStart = (event, type) => {
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('furniture-type', type)
}
</script>

<template>
  <div class="furniture-sidebar">
    <h2>Muebles</h2>
    <div 
      class="furniture-item" 
      draggable="true"
      @dragstart="handleDragStart($event, 'bed')"
    >
      🛏️ Cama
    </div>
    <!-- Otros muebles... -->
  </div>
</template>
```

---

#### c) [`RoomScene.vue`](src/components/RoomScene.vue) - ESCENA 3D PRINCIPAL

Este es el componente más complejo de la aplicación. Aquí es donde se renderiza la habitación, se cargan los modelos 3D y se gestiona toda la interacción.

**Estructura del Component:**
```vue
<template>
  <div class="scene-container">
    <div ref="sceneRef" class="three-scene"></div>
    <div v-if="selectedItem" class="item-controls">
      <button class="control-button" @click="rotateSelected">🔄 Rotar</button>
      <button class="control-button" @click="deleteSelected">🗑️ Eliminar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useFurnitureStore } from '../stores/furnitureStore'

// Variables y funciones...
</script>
```

**Pasos de Inicialización - onMounted:**

1. **Creación de la Escena:**
```javascript
scene = new THREE.Scene()
scene.background = new THREE.Color(0xf0f0f0) // Fondo gris claro
```

2. **Configuración de la Cámara:**
```javascript
camera = new THREE.PerspectiveCamera(
  75,
  sceneRef.value.clientWidth / sceneRef.value.clientHeight,
  0.1,
  1000
)
camera.position.set(8, 6, 8) // Posición inicial de la cámara
camera.lookAt(0, 0, 0) // Mira al centro de la habitación
```

3. **Renderer (Motor de Renderizado):**
```javascript
renderer = new THREE.WebGLRenderer({ antialias: true }) // Anti-aliasing para suavizar bordes
renderer.setSize(sceneRef.value.clientWidth, sceneRef.value.clientHeight)
renderer.shadowMap.enabled = true // Habilitar sombras
renderer.shadowMap.type = THREE.PCFSoftShadowMap // Tipo de sombra suave
renderer.physicallyCorrectLights = true // Iluminación física realista
```

4. **Controles de Cámara:**
```javascript
controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // Suavizar el movimiento
controls.dampingFactor = 0.05 // Factor de amortiguamiento
controls.minDistance = 5 // Distancia mínima de zoom
controls.maxDistance = 20 // Distancia máxima de zoom
controls.maxPolarAngle = Math.PI / 2 - 0.1 // No permitir ver desde abajo del suelo
```

5. **Event Listeners:**
```javascript
sceneRef.value.addEventListener('drop', handleDrop)
sceneRef.value.addEventListener('dragover', handleDragOver)
sceneRef.value.addEventListener('click', handleClick)
window.addEventListener('resize', handleResize)
window.addEventListener('keydown', handleKeyDown) // Teclado
```

---

##### **Función 1: Crear la Habitación (createRoom)**

Crea las paredes, suelo y techo de la habitación.

```javascript
const createRoom = () => {
  const roomWidth = 10 // Ancho (X)
  const roomDepth = 8  // Profundidad (Z)
  const roomHeight = 5 // Altura (Y)
  
  // Suelo
  const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth)
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf5f5dc, // Beige
    roughness: 0.8,   // Rugosidad
    metalness: 0.2    // Metallicidad
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2 // Colocar horizontalmente
  floor.receiveShadow = true // Recibir sombras
  scene.add(floor)
  
  // Paredes (back, left, right) y techo...
}
```

---

##### **Función 2: Crear Luces (createLights)**

Configura la iluminación para dar realismo a la escena.

```javascript
const createLights = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6) // Luz ambiental general
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8) // Luz direccional (sol)
  directionalLight.position.set(5, 8, 5) // Desde arriba a la derecha
  directionalLight.castShadow = true // Lanzar sombras
  // Configuración de sombras...
  scene.add(directionalLight)
  
  const pointLight = new THREE.PointLight(0xffffff, 0.5) // Luz puntual
  pointLight.position.set(0, 4, 0) // Centro de la habitación
  scene.add(pointLight)
}
```

---

##### **Función 3: Cargar Modelos 3D (loadGLBModel y loadFurnitureModel)**

Carga modelos 3D desde el directorio `modelos/`.

```javascript
const loadGLBModel = (url) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene
        
        // Configurar sombras
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true   // Lanzar sombras
            child.receiveShadow = true // Recibir sombras
          }
        })
        
        // Centrar el modelo
        const boundingBox = new THREE.Box3().setFromObject(model)
        const center = boundingBox.getCenter(new THREE.Vector3())
        const size = boundingBox.getSize(new THREE.Vector3())
        
        model.position.x = -center.x
        model.position.y = -size.y / 2 // Colocar sobre el suelo
        model.position.z = -center.z
        
        resolve(model)
      },
      undefined,
      reject
    )
  })
}

const loadFurnitureModel = async (type) => {
  switch (type) {
    case 'bed':
      return loadGLBModel('/modelos/bedDouble.glb')
    case 'desk':
      return loadGLBModel('/modelos/desk.glb')
    case 'chair':
      return loadGLBModel('/modelos/chair.glb')
    default:
      throw new Error('Unknown furniture type')
  }
}
```

---

##### **Función 4: Manejar el Soltar Muebles (handleDrop)**

Permite soltar muebles arrastrados desde la sidebar.

```javascript
const handleDrop = async (event) => {
  event.preventDefault()
  
  if (!sceneRef.value) return
  
  const type = event.dataTransfer?.getData('furniture-type') // Obtener tipo de mueble
  if (!type) return
  
  // Obtener posición del mouse en coordenadas de la escena
  const rect = sceneRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  mouse.x = (x / rect.width) * 2 - 1 // Normalizar a [-1, 1]
  mouse.y = -(y / rect.height) * 2 + 1 // Normalizar a [-1, 1]
  
  // Raycaster para detectar intersección con el suelo
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  
  // Buscar intersección con el suelo
  for (const intersect of intersects) {
    if (intersect.object.material && intersect.object.material.color?.getHex() === 0xf5f5dc) {
      furnitureStore.addFurniture(type, intersect.point.x, intersect.point.z)
      break
    }
  }
}
```

**Explicación:**
- `event.preventDefault()`: Evita el comportamiento predeterminado del navegador al soltar (como abrir el archivo)
- `dataTransfer.getData('furniture-type')`: Obtiene el tipo de mueble del evento dragstart
- `Raycaster`: Lanza un rayo desde la cámara a la posición del mouse para detectar el suelo
- El color del suelo es `0xf5f5dc` (beige), lo usamos para verificar que se ha soltado en el suelo

---

##### **Función 5: Seleccionar Muebles (handleClick)**

Detecta clics en muebles para mostrarlos los botones de control.

```javascript
const handleClick = (event) => {
  if (!sceneRef.value) return
  
  const rect = sceneRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  mouse.x = (x / rect.width) * 2 - 1
  mouse.y = -(y / rect.height) * 2 + 1
  
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(Object.values(furnitureMeshes), true)
  
  if (intersects.length > 0) {
    selectedItem.value = intersects[0].object.userData.item // Obtener datos del mueble
  } else {
    selectedItem.value = null // Deseleccionar si se clickea en vacío
  }
}
```

**Explicación:**
- `intersectObjects(Object.values(furnitureMeshes), true)`: Busca intersecciones recursivamente (para muebles compuestos por múltiples meshes)
- `object.userData.item`: Cada malla tiene almacenados los datos del mueble en `userData`

---

##### **Función 6: Actualizar Muebles (updateFurniture)**

Sincroniza el estado del store con la escena 3D.

```javascript
const updateFurniture = async () => {
  const storeItems = furnitureStore.items
  
  // Agregar muebles nuevos
  for (const item of storeItems) {
    if (!furnitureMeshes[item.id]) {
      try {
        const model = await loadFurnitureModel(item.type)
        
        // Añadir userData a todas las mallas hijas para que raycaster detecte
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.userData = { item }
          }
        })
        
        model.position.set(item.x, 0, item.y)
        model.rotation.y = (item.rotation * Math.PI) / 180
        furnitureMeshes[item.id] = model
        scene.add(model)
      } catch (error) {
        console.error('Error loading furniture model:', error)
      }
    } else {
      // Actualizar posición y rotación de muebles existentes
      const mesh = furnitureMeshes[item.id]
      mesh.position.set(item.x, 0, item.y)
      mesh.rotation.y = (item.rotation * Math.PI) / 180
    }
  }
  
  // Eliminar muebles que ya no están en el store
  const meshIds = Object.keys(furnitureMeshes).map(Number)
  const storeIds = storeItems.map(item => item.id)
  
  for (const id of meshIds) {
    if (!storeIds.includes(id)) {
      scene.remove(furnitureMeshes[id])
      delete furnitureMeshes[id]
    }
  }
}
```

---

##### **Función 7: Manejar Eventos de Teclado (handleKeyDown)**

**NUEVA FUNCIONALIDAD IMPLEMENTADA**

Permite mover, rotar y eliminar muebles usando el teclado.

```javascript
const handleKeyDown = (event) => {
  if (!selectedItem.value) return // No hacer nada si no hay mueble seleccionado
  
  const moveDistance = 0.5 // Distancia de movimiento por tecla
  
  switch (event.key) {
    case 'ArrowUp':
      furnitureStore.updateFurniturePosition(
        selectedItem.value.id,
        selectedItem.value.x,
        selectedItem.value.y + moveDistance // Sumar distancia a Z (hacia adelante)
      )
      break
    case 'ArrowDown':
      furnitureStore.updateFurniturePosition(
        selectedItem.value.id,
        selectedItem.value.x,
        selectedItem.value.y - moveDistance // Restar distancia a Z (hacia atrás)
      )
      break
    case 'ArrowLeft':
      furnitureStore.updateFurniturePosition(
        selectedItem.value.id,
        selectedItem.value.x - moveDistance, // Restar distancia a X (hacia izquierda)
        selectedItem.value.y
      )
      break
    case 'ArrowRight':
      furnitureStore.updateFurniturePosition(
        selectedItem.value.id,
        selectedItem.value.x + moveDistance, // Sumar distancia a X (hacia derecha)
        selectedItem.value.y
      )
      break
    case 'r':
    case 'R':
      furnitureStore.rotateFurniture(selectedItem.value.id) // Rotar 90 grados
      break
    case 'Delete':
    case 'Backspace':
      furnitureStore.removeFurniture(selectedItem.value.id)
      selectedItem.value = null // Deseleccionar después de eliminar
      break
  }
}
```

**Explicación Detallada de los Keylisteners:**

1. **Arrow Up (↑) - Mover hacia adelante:**
   - Suma `moveDistance` (0.5 unidades) a la propiedad `y` del mueble
   - En Three.js, el eje Z representa la profundidad, pero en la aplicación lo llamamos `y` por conveniencia
   - Esto mueve el mueble en dirección positiva del eje Z (hacia la pared trasera)

2. **Arrow Down (↓) - Mover hacia atrás:**
   - Resta `moveDistance` a la propiedad `y` del mueble
   - Mueve el mueble en dirección negativa del eje Z (hacia la cámara)

3. **Arrow Left (←) - Mover hacia la izquierda:**
   - Resta `moveDistance` a la propiedad `x` del mueble
   - Mueve el mueble en dirección negativa del eje X

4. **Arrow Right (→) - Mover hacia la derecha:**
   - Suma `moveDistance` a la propiedad `x` del mueble
   - Mueve el mueble en dirección positiva del eje X

**Nota Importante sobre el Espacio Coordinado:**
La aplicación usa un sistema de coordenadas donde:
- **X**: Izquierda (-) / Derecha (+)
- **Z**: Atrás (-) / Adelante (+) (llamado `y` en la aplicación para simplificar)
- **Y**: Arriba (+) / Abajo (-) (solo para altura, los muebles están siempre en Y=0)

---

##### **Función 8: Rotar y Eliminar Muebles**

```javascript
const rotateSelected = () => {
  if (!selectedItem.value) return
  furnitureStore.rotateFurniture(selectedItem.value.id)
}

const deleteSelected = () => {
  if (!selectedItem.value) return
  furnitureStore.removeFurniture(selectedItem.value.id)
  selectedItem.value = null
}
```

---

##### **Bucle de Animación (animate)**

```javascript
const animate = () => {
  requestAnimationFrame(animate)
  
  controls.update() // Actualizar controles de cámara
  updateFurniture() // Actualizar muebles
  renderer.render(scene, camera) // Renderizar la escena
}
```

---

### 3. **Gestión de Estado - [`furnitureStore.js`](src/stores/furnitureStore.js)**

Tienda de estado que almacena la lista de muebles y las acciones para manipularlos.

```javascript
import { defineStore } from 'pinia'

export const useFurnitureStore = defineStore('furniture', {
  state: () => ({
    items: [] // Lista de muebles
  }),
  
  actions: {
    // Añadir un nuevo mueble
    addFurniture(type, x, y) {
      const newItem = {
        id: Date.now(), // Id único basado en timestamp
        type,
        x,
        y,
        rotation: 0 // Rotación inicial
      }
      this.items.push(newItem)
    },
    
    // Eliminar un mueble por id
    removeFurniture(id) {
      const index = this.items.findIndex(item => item.id === id)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
    },
    
    // Actualizar posición de un mueble
    updateFurniturePosition(id, x, y) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        item.x = x
        item.y = y
      }
    },
    
    // Rotar un mueble 90 grados
    rotateFurniture(id) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        item.rotation = (item.rotation + 90) % 360 // Rotación modular 360
      }
    },
    
    // Limpiar todos los muebles
    clearAll() {
      this.items = []
    }
  },
  
  getters: {
    // Contar total de muebles
    totalItems: (state) => state.items.length
  }
})
```

**Explicación:**
- `addFurniture`: Crea un nuevo mueble con id único
- `updateFurniturePosition`: Actualiza coordenadas
- `rotateFurniture`: Gira 90 grados (modular para que nunca supere 360)
- `removeFurniture`: Elimina un mueble por id
- `clearAll`: Vacía la lista de muebles

---

## Conceptos Clave

### 1. **Sistema de Arrastrar y Soltar**

La aplicación utiliza la API de HTML5 Drag and Drop:
- En `FurnitureSidebar.vue`, los items se marcan como `draggable="true"`.
- El evento `dragstart` guarda el tipo de mueble.
- En `RoomScene.vue`, el evento `drop` detecta la posición del mouse y coloca el mueble en la escena.

### 2. **Detección de Intersecciones**

Para la selección de muebles:
- Se usa `Raycaster` de Three.js para proyectar un rayo desde la posición del mouse.
- La función `intersectObjects` busca intersecciones con los muebles.
- Se recorre la escena gráficamente desde el punto de intersección para encontrar el objeto padre que contiene los datos del mueble.

### 3. **Carga de Modelos 3D**

Los modelos se cargan en formato GLB usando `GLTFLoader`:
- Se ajusta la posición de cada modelo para que se coloque en el suelo.
- Se configuran las sombras para mejorar la iluminación.
- Los modelos se almacenan en un diccionario para un acceso rápido.

## Funcionalidades Implementadas

1. **Agregar Muebles**: Arrastrar y soltar muebles desde la sidebar a la escena.
2. **Rotar Muebles**: Seleccionar un mueble y hacer clic en el botón de rotación.
3. **Eliminar Muebles**: Seleccionar un mueble y hacer clic en el botón de eliminar.
4. **Limpiar Escena**: Eliminar todos los muebles de la escena.
5. **Interacción 3D**: Rotar y zoom de la vista con el ratón.
6. **Controles de Teclado**: Mover con flechas, rotar con R, eliminar con Delete/Backspace.

## Ejecución del Proyecto

### Instalación de Dependencias

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

### Construcción para Producción

```bash
npm run build
```

### Vista Previa de la Construcción

```bash
npm run preview
```

## Conclusión

Este proyecto demuestra la integración de Vue 3, Three.js y Pinia para crear una aplicación 3D interactiva. La arquitectura modular y la separación de responsabilidades entre componentes y store hace que el código sea mantenible y escalable. El uso de TypeScript mejora la calidad del código y reduce los errores.

Las funcionalidades de teclado implementadas recientemente proporcionan una forma más precisa y cómoda de manipular los muebles, complementando perfectamente la interfaz con mouse.
