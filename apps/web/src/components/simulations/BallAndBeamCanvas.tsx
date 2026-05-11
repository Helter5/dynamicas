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

export interface BallAndBeamDataPoint extends SimulationDataPoint {
  t: number
  r: number
  r_dot: number
  alpha: number
  alpha_dot: number
}

interface BallAndBeamCanvasProps {
  point: BallAndBeamDataPoint | null
  beamLength?: number
  className?: string
}

type BallBeamScene = {
  engine: Engine
  scene: Scene
  beam: Mesh
  ball: Mesh
  pivot: Mesh
  beamLength: number
}

type BallBeamPose = {
  r: number
  alpha: number
}

function createScene(canvas: HTMLCanvasElement, beamLength: number): BallBeamScene {
  const { engine, scene } = createSimulationScene(canvas, {
    cameraAlpha: Math.PI / 2.15,
    cameraBeta: Math.PI / 3,
    cameraRadius: 4.5,
    cameraTarget: new Vector3(0, 0.38, 0),
    lowerRadiusLimit: 3,
    upperRadiusLimit: 6.5,
    lightDirection: new Vector3(0.45, 1, 0.25),
    lightIntensity: 0.84,
  })

  const baseMat = createStandardMaterial(scene, 'baseMat', new Color3(0.78, 0.8, 0.84))
  const beamMat = createStandardMaterial(scene, 'beamMat', new Color3(0.06, 0.09, 0.14))
  const ballMat = createStandardMaterial(scene, 'ballMat', new Color3(0.93, 0.18, 0.16))
  const pivotMat = createStandardMaterial(scene, 'pivotMat', new Color3(0.2, 0.24, 0.3))

  const ground = MeshBuilder.CreateBox('ground', { width: 4.8, height: 0.04, depth: 1.7 }, scene)
  ground.position.y = -0.45
  ground.material = baseMat

  const support = MeshBuilder.CreateCylinder('support', { diameterTop: 0.2, diameterBottom: 0.7, height: 0.84, tessellation: 4 }, scene)
  support.position.y = -0.05
  support.rotation.y = Math.PI / 4
  support.material = baseMat

  const beam = MeshBuilder.CreateBox('beam', { width: 2.8, height: 0.08, depth: 0.22 }, scene)
  beam.position.y = 0.45
  beam.material = beamMat

  const pivot = MeshBuilder.CreateSphere('pivot', { diameter: 0.18, segments: 24 }, scene)
  pivot.position.y = 0.45
  pivot.material = pivotMat

  const ball = MeshBuilder.CreateSphere('ball', { diameter: 0.22, segments: 32 }, scene)
  ball.material = ballMat

  return {
    engine,
    scene,
    beam,
    ball,
    pivot,
    beamLength,
  }
}

function poseFromPoint(point: BallAndBeamDataPoint | null): BallBeamPose {
  return {
    r: point?.r ?? 0,
    alpha: point?.alpha ?? 0,
  }
}

function lerp(current: number, target: number, amount: number) {
  return current + (target - current) * amount
}

function smoothPose(current: BallBeamPose, target: BallBeamPose): BallBeamPose {
  return {
    r: lerp(current.r, target.r, 0.18),
    alpha: lerp(current.alpha, target.alpha, 0.18),
  }
}

function updateBallBeam(scene: BallBeamScene, pose: BallBeamPose) {
  const alpha = pose.alpha
  const halfBeam = scene.beamLength / 2
  const clampedR = Math.max(-halfBeam, Math.min(halfBeam, pose.r))
  const visualScale = 2.8 / scene.beamLength
  const distance = clampedR * visualScale
  const cosA = Math.cos(alpha)
  const sinA = Math.sin(alpha)
  const centerY = 0.45

  scene.beam.rotation.z = alpha
  scene.ball.position.set(distance * cosA, centerY + distance * sinA + 0.16, 0)
  scene.pivot.position.set(0, centerY, 0)
}

export function BallAndBeamCanvas({
  point,
  beamLength = 1,
  className,
}: BallAndBeamCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<BallBeamScene | null>(null)
  const currentPoseRef = useRef<BallBeamPose>(poseFromPoint(point))
  const targetPoseRef = useRef<BallBeamPose>(poseFromPoint(point))

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const nextScene = createScene(canvas, beamLength)
    const initialPose = poseFromPoint(point)
    sceneRef.current = nextScene
    currentPoseRef.current = initialPose
    targetPoseRef.current = initialPose
    updateBallBeam(nextScene, initialPose)

    nextScene.scene.onBeforeRenderObservable.add(() => {
      currentPoseRef.current = smoothPose(currentPoseRef.current, targetPoseRef.current)
      updateBallBeam(nextScene, currentPoseRef.current)
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
  }, [beamLength])

  useEffect(() => {
    targetPoseRef.current = poseFromPoint(point)
  }, [point])

  return (
    <div ref={containerRef} className={className ?? 'h-48 w-full'}>
      <canvas ref={canvasRef} className="h-full w-full rounded-[inherit] outline-none" />
    </div>
  )
}
