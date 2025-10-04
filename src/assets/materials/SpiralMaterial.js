import { Fn, vec3, positionLocal, positionGeometry, positionWorld, uniform, attribute, modelWorldMatrix, float, min, color, smoothstep, time, cos, sin } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'

export const SpiralMaterial = new MeshBasicNodeMaterial()

export const pointRadius = uniform(2.5)
export const pointStrength = uniform(2.5)

const pointA = vec3()
const pointB = vec3()

const iPosition = attribute( 'a_InstancePosition', 'vec3' )

SpiralMaterial.positionNode = Fn(() => {
  // const xA = cos(time)
  // const yA = sin(time)
  // pointA.assign(vec3(xA, 0, yA))

  const d = pointA.distance(modelWorldMatrix.mul(iPosition))
  const d2 = pointB.distance(modelWorldMatrix.mul(iPosition))

  d.assign(min(d, d2))
  d.assign(min(d, pointStrength))
  d.assign(float(pointStrength).sub(d))

  return positionWorld.add(vec3(0, d, 0))
})()

SpiralMaterial.colorNode = Fn(() => {
  const colorA = color(1.0, 1.0, 1.0)
  const colorB = color(0, 0, 0)

  const t = smoothstep(-1.0, 1.0, positionLocal.y)
  const col = colorA.mix(colorB, t)

  return col
})()
