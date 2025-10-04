<template>
	<canvas
		class="canvas"
		ref="canvas"
		:width="windowWidth"
		:height="windowHeight"
	/>
</template>

<script setup>
import { useTemplateRef, onMounted, nextTick, watch } from 'vue'
import {
	useWindowSize,
	useDevicePixelRatio,
	useUrlSearchParams,
	get,
} from '@vueuse/core'
import * as THREE from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls'

import { useGSAP } from '@/composables/useGSAP'
import { SpiralMaterial } from '@/assets/materials'

const canvasRef = useTemplateRef('canvas')
let perfPanel, scene, camera, renderer, spiral, controls, dirLight

const { width: windowWidth, height: windowHeight } = useWindowSize()
const { pixelRatio: dpr } = useDevicePixelRatio()
const params = useUrlSearchParams('history')

const { gsap } = useGSAP()

//
// Lifecycle
//
onMounted(async () => {
	await nextTick()

	createScene()
	createCamera()
	createRenderer()

	createSpiral()
	createLight()

	createControls()

	gsap.ticker.fps(60)

	gsap.ticker.add(time => {
		perfPanel?.begin()

		updateScene(time)
		renderer.renderAsync(scene, camera)

		perfPanel?.end()
	})

	if (Object.hasOwn(params, 'debug')) {
		const { Debug } = await import('@/assets/Debug')
		const debug = new Debug(dirLight)
		debug.init()

		if (!renderer.isWebGPURenderer) {
			const { ThreePerf } = await import('three-perf')

			perfPanel = new ThreePerf({
				anchorX: 'left',
				anchorY: 'top',
				domElement: document.body,
				renderer,
			})
		}
	}
})

//
// Watchers
//
watch(dpr, value => {
	renderer.setPixelRatio(value)
})

watch([windowWidth, windowHeight], value => {
	camera.aspect = value[0] / value[1]
	camera.updateProjectionMatrix()

	renderer.setSize(value[0], value[1])
})

//
// Methods
//
function updateScene(time = 0) {
	controls.update()
	spiral?.rotation?.set(0, time * 0.13, 0)
}

function createScene() {
	scene = new THREE.Scene()
}

function createCamera() {
	camera = new THREE.PerspectiveCamera(
		40,
		get(windowWidth) / get(windowHeight),
		0.1,
		100
	)

	camera.position.set(0, 15, 20)
	camera.lookAt(0, 0, 0)
}

function createRenderer() {
	renderer = new THREE.WebGPURenderer({
		canvas: get(canvasRef),
		alpha: true,
		antialias: true,
	})

	renderer.setClearColor(0x121212, 1)
	renderer.setSize(get(windowWidth), get(windowHeight))
}

function createSpiral() {
	const count = 1000
	const matrix = new THREE.Matrix4()

	const geometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32)
	spiral = new THREE.InstancedMesh(geometry, SpiralMaterial, count)

	const positions = new Float32Array(count * 3)

	for (let i = 0; i < count; i++) {
		{
			const { x, y: z } = phyllotaxis(i)
			const y = 0

			matrix.makeTranslation(x, y, z)

			positions[i * 3] = x
			positions[i * 3 + 1] = y
			positions[i * 3 + 2] = z
		}

		spiral.setMatrixAt(i, matrix)
	}

	spiral.instanceMatrix.needsUpdate = true

	const positionsAttribute = new THREE.InstancedBufferAttribute(positions, 3)
	geometry.setAttribute('a_InstancePosition', positionsAttribute)

	scene.add(spiral)
}

function createLight() {
	dirLight = new THREE.DirectionalLight(0xffffff, 100)
	dirLight.position.set(0, 10, -10)

	scene.add(dirLight)

	const helper = new THREE.DirectionalLightHelper(dirLight, 1)
	scene.add(helper)
}

function phyllotaxis(i) {
	const c = 0.3

	const a = i * 137.5
	const r = c * Math.sqrt(i)
	const x = r * Math.cos(a)
	const y = r * Math.sin(a)

	return { x, y }
}

function createControls() {
	controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
}
</script>

<style scoped>
.canvas {
	height: 100dvh;
	width: 100dvw;
}
</style>
