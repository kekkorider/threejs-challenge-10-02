import { PI, Fn, vec3, positionLocal, positionGeometry, positionWorld, uniform, attribute, modelWorldMatrix, float, min, color, smoothstep, time, cos, sin } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'

export const SpiralMaterial = new MeshBasicNodeMaterial()

export const pointRadius = uniform(4)
export const pointStrength = uniform(2.5)
export const pointsSpeed = uniform(1)

const pointA = vec3().toVar()
const pointB = vec3().toVar()

const iPosition = attribute( 'a_InstancePosition', 'vec3' )

SpiralMaterial.positionNode = Fn(() => {
  const t = time.mul(pointsSpeed)

  const xA = cos(t).mul(pointRadius)
  const yA = sin(t).mul(pointRadius)
  pointA.assign(vec3(xA, 0, yA))

  const xB = cos(t.add(PI)).mul(pointRadius)
  const yB = sin(t.add(PI)).mul(pointRadius)
  pointB.assign(vec3(xB, 0, yB))

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
