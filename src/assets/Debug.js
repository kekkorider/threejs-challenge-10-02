import { Pane } from 'tweakpane'

import { pointRadius, pointStrength } from '@/assets/materials/SpiralMaterial'

const pane = new Pane()

pane.addBinding(pointRadius, 'value', { label: 'pointRadius', min: 0, max: 6, step: 0.01 })
pane.addBinding(pointStrength, 'value', { label: 'pointStrength', min: 0, max: 3, step: 0.01 })
