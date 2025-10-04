import { Pane } from 'tweakpane'
import { pointRadius, pointStrength, pointsSpeed } from '@/assets/materials/SpiralMaterial'

export class Debug {
	constructor(dirLight) {
		this.pane = new Pane()
    this.dirLight = dirLight
	}

	init() {
		this.pane.addBinding(pointRadius, 'value', { label: 'pointRadius', min: 0, max: 6, step: 0.01 })
		this.pane.addBinding(pointStrength, 'value', { label: 'pointStrength', min: 0, max: 5, step: 0.01 })
		this.pane.addBinding(pointsSpeed, 'value', { label: 'pointsSpeed', min: 0, max: 2, step: 0.01 })

		this.pane.addBinding(this.dirLight, 'intensity', { label: 'light intensity', min: 0, max: 200, step: 0.5 })
		this.pane.addBinding(this.dirLight.position, 'x', { label: 'light position X', min: -10, max: 10, step: 0.05 })
	}
}
