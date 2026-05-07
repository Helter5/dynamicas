import { useEffect, useRef } from 'react'
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

export function BallAndBeamCanvas({
  point,
  beamLength = 1,
  className,
}: BallAndBeamCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const dpr = window.devicePixelRatio ?? 1
    const { clientWidth, clientHeight } = container

    if (canvas.width !== clientWidth * dpr || canvas.height !== clientHeight * dpr) {
      canvas.width = clientWidth * dpr
      canvas.height = clientHeight * dpr
      canvas.style.width = `${clientWidth}px`
      canvas.style.height = `${clientHeight}px`
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.scale(dpr, dpr)

    const W = clientWidth
    const H = clientHeight
    const centerX = W / 2
    const centerY = H * 0.55
    const beamPixels = W * 0.78
    const alpha = point?.alpha ?? 0
    const halfBeam = beamPixels / 2
    const cosA = Math.cos(alpha)
    const sinA = Math.sin(alpha)

    const leftX = centerX - halfBeam * cosA
    const leftY = centerY - halfBeam * sinA
    const rightX = centerX + halfBeam * cosA
    const rightY = centerY + halfBeam * sinA

    // Base and support
    ctx.strokeStyle = '#64748b'
    ctx.fillStyle = '#cbd5e1'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY + 12)
    ctx.lineTo(centerX - 32, H * 0.86)
    ctx.lineTo(centerX + 32, H * 0.86)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(W * 0.12, H * 0.86)
    ctx.lineTo(W * 0.88, H * 0.86)
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Beam
    ctx.beginPath()
    ctx.moveTo(leftX, leftY)
    ctx.lineTo(rightX, rightY)
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 8
    ctx.lineCap = 'round'
    ctx.stroke()

    // Pivot
    ctx.beginPath()
    ctx.arc(centerX, centerY, 7, 0, Math.PI * 2)
    ctx.fillStyle = '#334155'
    ctx.fill()

    if (point) {
      const clampedR = Math.max(-beamLength / 2, Math.min(beamLength / 2, point.r))
      const pixelsPerMeter = beamPixels / beamLength
      const distanceFromCenter = clampedR * pixelsPerMeter
      const ballX = centerX + distanceFromCenter * cosA
      const ballY = centerY + distanceFromCenter * sinA - 12

      ctx.beginPath()
      ctx.arc(ballX, ballY, 11, 0, Math.PI * 2)
      ctx.fillStyle = '#ef4444'
      ctx.strokeStyle = '#b91c1c'
      ctx.lineWidth = 2
      ctx.fill()
      ctx.stroke()
    }

    ctx.resetTransform()
  }, [point, beamLength])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = 0
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={className ?? 'h-48 w-full'}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
