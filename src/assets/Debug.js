import { Pane } from 'tweakpane'

import { pointRadius, pointStrength, pointsSpeed } from '@/assets/materials/SpiralMaterial'

const pane = new Pane()

pane.addBinding(pointRadius, 'value', { label: 'pointRadius', min: 0, max: 6, step: 0.01 })
pane.addBinding(pointStrength, 'value', { label: 'pointStrength', min: 0, max: 3, step: 0.01 })
pane.addBinding(pointsSpeed, 'value', { label: 'pointsSpeed', min: 0, max: 2, step: 0.01 })
