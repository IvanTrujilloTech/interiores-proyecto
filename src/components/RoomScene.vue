<template>
  <div class="scene-container">
    <div ref="sceneRef" class="three-scene"></div>
    <div v-if="selectedItem" class="item-controls">
      <button class="control-button" @click="rotateSelected">Rotar</button>
      <button class="control-button" @click="deleteSelected">Eliminar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useFurnitureStore } from '../stores/furnitureStore'

const sceneRef = ref(null)
const selectedItem = ref(null)

const furnitureStore = useFurnitureStore()

let scene
let camera
let renderer
let controls
let raycaster
let mouse
let furnitureMeshes = {}

const loadGLBModel = (url) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        
        const boundingBox = new THREE.Box3().setFromObject(model)
        const center = boundingBox.getCenter(new THREE.Vector3())
        const size = boundingBox.getSize(new THREE.Vector3())
        
        model.position.x = -center.x
        model.position.y = -size.y / 2
        model.position.z = -center.z
        
        resolve(model)
      },
      undefined,
      reject
    )
  })
}

const createRoom = () => {
  const roomWidth = 10
  const roomDepth = 8
  const roomHeight = 5
  
  const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth)
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf5f5dc,
    roughness: 0.8,
    metalness: 0.2
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)
  
  const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xe8e8e8,
    roughness: 0.7,
    metalness: 0.1
  })
  
  const backWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight)
  const backWall = new THREE.Mesh(backWallGeometry, wallMaterial)
  backWall.position.z = -roomDepth / 2
  backWall.position.y = roomHeight / 2
  backWall.receiveShadow = true
  scene.add(backWall)
  
  const leftWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight)
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial)
  leftWall.position.x = -roomWidth / 2
  leftWall.position.y = roomHeight / 2
  leftWall.rotation.y = Math.PI / 2
  leftWall.receiveShadow = true
  scene.add(leftWall)
  
  const rightWall = leftWall.clone()
  rightWall.position.x = roomWidth / 2
  rightWall.rotation.y = -Math.PI / 2
  scene.add(rightWall)
  
  const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth)
  const ceilingMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xfafafa,
    roughness: 0.7,
    metalness: 0.1
  })
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.y = roomHeight
  ceiling.receiveShadow = true
  scene.add(ceiling)
}

const createLights = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 8, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.near = 0.1
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.left = -10
  directionalLight.shadow.camera.right = 10
  directionalLight.shadow.camera.top = 10
  directionalLight.shadow.camera.bottom = -10
  scene.add(directionalLight)
  
  const pointLight = new THREE.PointLight(0xffffff, 0.5)
  pointLight.position.set(0, 4, 0)
  scene.add(pointLight)
}

const handleDrop = async (event) => {
  event.preventDefault()
  
  if (!sceneRef.value) return
  
  const type = event.dataTransfer?.getData('furniture-type')
  if (!type) return
  
  const rect = sceneRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  mouse.x = (x / rect.width) * 2 - 1
  mouse.y = -(y / rect.height) * 2 + 1
  
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  
  for (const intersect of intersects) {
    if (intersect.object.material && intersect.object.material.color?.getHex() === 0xf5f5dc) {
      furnitureStore.addFurniture(type, intersect.point.x, intersect.point.z)
      break
    }
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
}

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
    selectedItem.value = intersects[0].object.userData.item
  } else {
    selectedItem.value = null
  }
}

const rotateSelected = () => {
  if (!selectedItem.value) return
  furnitureStore.rotateFurniture(selectedItem.value.id)
}

const deleteSelected = () => {
  if (!selectedItem.value) return
  furnitureStore.removeFurniture(selectedItem.value.id)
  selectedItem.value = null
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

const updateFurniture = async () => {
  const storeItems = furnitureStore.items
  
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
      const mesh = furnitureMeshes[item.id]
      mesh.position.set(item.x, 0, item.y)
      mesh.rotation.y = (item.rotation * Math.PI) / 180
    }
  }
  
  const meshIds = Object.keys(furnitureMeshes).map(Number)
  const storeIds = storeItems.map(item => item.id)
  
  for (const id of meshIds) {
    if (!storeIds.includes(id)) {
      scene.remove(furnitureMeshes[id])
      delete furnitureMeshes[id]
    }
  }
}

const animate = () => {
  requestAnimationFrame(animate)
  
  controls.update()
  updateFurniture()
  renderer.render(scene, camera)
}

const handleKeyDown = (event) => {
  if (!selectedItem.value) return
  
  const moveDistance = 0.5
  
  switch (event.key) {
    case 'ArrowDown':
      furnitureStore.updateFurniturePosition(
        selectedItem.value.id,
        selectedItem.value.x,
        selectedItem.value.y + moveDistance
      )
      break
    case 'ArrowUp':
      furnitureStore.updateFurniturePosition(
        selectedItem.value.id,
        selectedItem.value.x,
        selectedItem.value.y - moveDistance
      )
      break
    case 'ArrowLeft':
      furnitureStore.updateFurniturePosition(
        selectedItem.value.id,
        selectedItem.value.x - moveDistance,
        selectedItem.value.y
      )
      break
    case 'ArrowRight':
      furnitureStore.updateFurniturePosition(
        selectedItem.value.id,
        selectedItem.value.x + moveDistance,
        selectedItem.value.y
      )
      break
    case 'r':
    case 'R':
      furnitureStore.rotateFurniture(selectedItem.value.id)
      break
    case 'Delete':
    case 'Backspace':
      furnitureStore.removeFurniture(selectedItem.value.id)
      selectedItem.value = null
      break
  }
}

onMounted(async () => {
  if (!sceneRef.value) return
  
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)
  
  camera = new THREE.PerspectiveCamera(
    75,
    sceneRef.value.clientWidth / sceneRef.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(8, 6, 8)
  camera.lookAt(0, 0, 0)
  
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(sceneRef.value.clientWidth, sceneRef.value.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.physicallyCorrectLights = true
  sceneRef.value.appendChild(renderer.domElement)
  
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 5
  controls.maxDistance = 20
  controls.maxPolarAngle = Math.PI / 2 - 0.1
  
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()
  
  createRoom()
  createLights()
  
  sceneRef.value.addEventListener('drop', handleDrop)
  sceneRef.value.addEventListener('dragover', handleDragOver)
  sceneRef.value.addEventListener('click', handleClick)
  
  const handleResize = () => {
    if (!sceneRef.value) return
    camera.aspect = sceneRef.value.clientWidth / sceneRef.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(sceneRef.value.clientWidth, sceneRef.value.clientHeight)
  }
  
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeyDown)
  
  animate()
})

onUnmounted(() => {
  if (sceneRef.value) {
    sceneRef.value.removeEventListener('drop', handleDrop)
    sceneRef.value.removeEventListener('dragover', handleDragOver)
    sceneRef.value.removeEventListener('click', handleClick)
  }
  
  window.removeEventListener('resize', () => {})
  window.removeEventListener('keydown', handleKeyDown)
  
  renderer.dispose()
})
</script>

<style scoped>
.scene-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.three-scene {
  width: 100%;
  height: 100%;
}

.item-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.control-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.control-button:hover {
  background-color: #2980b9;
}

.control-button:nth-child(2) {
  background-color: #e74c3c;
}

.control-button:nth-child(2):hover {
  background-color: #c0392b;
}
</style>
