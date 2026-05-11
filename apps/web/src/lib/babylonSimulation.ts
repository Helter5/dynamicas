import {
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  HemisphericLight,
  Scene,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core'

type SceneOptions = {
  cameraAlpha: number
  cameraBeta: number
  cameraRadius: number
  cameraTarget: Vector3
  lowerRadiusLimit: number
  upperRadiusLimit: number
  lightDirection: Vector3
  lightIntensity?: number
}

export function createSimulationScene(canvas: HTMLCanvasElement, options: SceneOptions) {
  const engine = new Engine(canvas, true, {
    antialias: true,
    preserveDrawingBuffer: false,
    stencil: false,
  })
  const scene = new Scene(engine)
  scene.clearColor = new Color4(0.96, 0.96, 0.98, 1)

  const camera = new ArcRotateCamera(
    'camera',
    options.cameraAlpha,
    options.cameraBeta,
    options.cameraRadius,
    options.cameraTarget,
    scene,
  )
  camera.attachControl(canvas, true)
  camera.lowerRadiusLimit = options.lowerRadiusLimit
  camera.upperRadiusLimit = options.upperRadiusLimit
  camera.wheelDeltaPercentage = 0.02

  new HemisphericLight('light', options.lightDirection, scene).intensity = options.lightIntensity ?? 0.84

  engine.runRenderLoop(() => scene.render())

  return {
    engine,
    scene,
  }
}

export function createStandardMaterial(scene: Scene, name: string, color: Color3) {
  const mat = new StandardMaterial(name, scene)
  mat.diffuseColor = color
  mat.specularColor = new Color3(0.08, 0.08, 0.08)
  return mat
}

export function observeEngineResize(element: Element, engine: Engine) {
  const observer = new ResizeObserver(() => engine.resize())
  observer.observe(element)

  return () => observer.disconnect()
}
