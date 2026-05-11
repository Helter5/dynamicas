import { useEffect, useRef } from 'react'
import {
  Color3,
  Engine,
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
} from '@babylonjs/core'
import { createSimulationScene, createStandardMaterial, observeEngineResize } from '@/lib/babylonSimulation'
import type { SimulationDataPoint } from './SimulationResults'

export interface InvertedPendulumDataPoint extends SimulationDataPoint {
  x: number
  v: number
  theta: number
  omega: number
}

interface InvertedPendulumCanvasProps {
  point: InvertedPendulumDataPoint | null
  pendulumLength?: number
  xRange?: number
  className?: string
}

type PendulumScene = {
  engine: Engine
  scene: Scene
  cart: Mesh
  rod: Mesh
  bob: Mesh
  pivot: Mesh
  wheels: Mesh[]
  pendulumLength: number
  xRange: number
}

type PendulumPose = {
  x: number
  theta: number
}

function createScene(canvas: HTMLCanvasElement, pendulumLength: number, xRange: number): PendulumScene {
  const { engine, scene } = createSimulationScene(canvas, {
    cameraAlpha: Math.PI / 2.2,
    cameraBeta: Math.PI / 3,
    cameraRadius: 5.2,
    cameraTarget: new Vector3(0, 0.45, 0),
    lowerRadiusLimit: 3.2,
    upperRadiusLimit: 7.5,
    lightDirection: new Vector3(0.4, 1, 0.2),
    lightIntensity: 0.82,
  })

  const railMat = createStandardMaterial(scene, 'railMat', new Color3(0.33, 0.38, 0.45))
  const groundMat = createStandardMaterial(scene, 'groundMat', new Color3(0.82, 0.84, 0.88))
  const cartMat = createStandardMaterial(scene, 'cartMat', new Color3(0.0, 0.44, 0.89))
  const wheelMat = createStandardMaterial(scene, 'wheelMat', new Color3(0.1, 0.12, 0.16))
  const rodMat = createStandardMaterial(scene, 'rodMat', new Color3(0.05, 0.08, 0.13))
  const bobMat = createStandardMaterial(scene, 'bobMat', new Color3(0.93, 0.18, 0.16))

  const ground = MeshBuilder.CreateBox('ground', { width: 5.8, height: 0.04, depth: 1.8 }, scene)
  ground.position.y = -0.42
  ground.material = groundMat

  const rail = MeshBuilder.CreateBox('rail', { width: 5.4, height: 0.05, depth: 0.08 }, scene)
  rail.position.y = 0
  rail.material = railMat

  const cart = MeshBuilder.CreateBox('cart', { width: 0.72, height: 0.32, depth: 0.5 }, scene)
  cart.position.y = 0.22
  cart.material = cartMat

  const wheels = [-0.22, 0.22].map((offset) => {
    const wheel = MeshBuilder.CreateCylinder('wheel', { diameter: 0.16, height: 0.56, tessellation: 32 }, scene)
    wheel.rotation.x = Math.PI / 2
    wheel.position.set(offset, 0.02, 0)
    wheel.material = wheelMat
    return wheel
  })

  const rod = MeshBuilder.CreateBox('rod', { width: 0.045, height: pendulumLength, depth: 0.045 }, scene)
  rod.material = rodMat

  const bob = MeshBuilder.CreateSphere('bob', { diameter: 0.18, segments: 32 }, scene)
  bob.material = bobMat

  const pivot = MeshBuilder.CreateSphere('pivot', { diameter: 0.09, segments: 24 }, scene)
  pivot.material = rodMat

  return {
    engine,
    scene,
    cart,
    rod,
    bob,
    pivot,
    wheels,
    pendulumLength,
    xRange,
  }
}

function poseFromPoint(point: InvertedPendulumDataPoint | null): PendulumPose {
  return {
    x: point?.x ?? 0,
    theta: point?.theta ?? 0,
  }
}

function lerp(current: number, target: number, amount: number) {
  return current + (target - current) * amount
}

function smoothPose(current: PendulumPose, target: PendulumPose): PendulumPose {
  return {
    x: lerp(current.x, target.x, 0.18),
    theta: lerp(current.theta, target.theta, 0.18),
  }
}

function updatePendulum(scene: PendulumScene, pose: PendulumPose) {
  const x = pose.x
  const theta = pose.theta
  const cartX = Math.max(-scene.xRange, Math.min(scene.xRange, x)) * 0.72
  const pivot = new Vector3(cartX, 0.42, 0)
  const bob = new Vector3(
    pivot.x + Math.sin(theta) * scene.pendulumLength,
    pivot.y + Math.cos(theta) * scene.pendulumLength,
    0,
  )

  scene.cart.position.x = cartX
  scene.pivot.position.copyFrom(pivot)
  scene.bob.position.copyFrom(bob)
  scene.rod.position.set((pivot.x + bob.x) / 2, (pivot.y + bob.y) / 2, 0)
  scene.rod.rotation.set(0, 0, -theta)

  scene.wheels.forEach((wheel, index) => {
    wheel.position.x = cartX + (index === 0 ? -0.22 : 0.22)
    wheel.rotation.y = -cartX * 2.8
  })
}

export function InvertedPendulumCanvas({
  point,
  pendulumLength = 0.9,
  xRange = 3,
  className,
}: InvertedPendulumCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<PendulumScene | null>(null)
  const currentPoseRef = useRef<PendulumPose>(poseFromPoint(point))
  const targetPoseRef = useRef<PendulumPose>(poseFromPoint(point))

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const nextScene = createScene(canvas, pendulumLength, xRange)
    const initialPose = poseFromPoint(point)
    sceneRef.current = nextScene
    currentPoseRef.current = initialPose
    targetPoseRef.current = initialPose
    updatePendulum(nextScene, initialPose)

    nextScene.scene.onBeforeRenderObservable.add(() => {
      currentPoseRef.current = smoothPose(currentPoseRef.current, targetPoseRef.current)
      updatePendulum(nextScene, currentPoseRef.current)
    })

    const resize = () => nextScene.engine.resize()
    const unobserveResize = observeEngineResize(container, nextScene.engine)
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      unobserveResize()
      nextScene.engine.dispose()
      sceneRef.current = null
    }
  }, [pendulumLength, xRange])

  useEffect(() => {
    targetPoseRef.current = poseFromPoint(point)
  }, [point])

  return (
    <div ref={containerRef} className={className ?? 'h-48 w-full'}>
      <canvas ref={canvasRef} className="h-full w-full rounded-[inherit] outline-none" />
    </div>
  )
}
