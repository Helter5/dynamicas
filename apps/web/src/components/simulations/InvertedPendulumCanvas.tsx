import { useEffect, useRef } from 'react'
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

export function InvertedPendulumCanvas({
  point,
  pendulumLength = 0.5,
  xRange = 3,
  className,
}: InvertedPendulumCanvasProps) {
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

    // Coordinate mapping: x=0 is center, scale so xRange fills the width
    const pxPerMeter = (W * 0.85) / (xRange * 2)
    const railY = H * 0.65

    // Ground
    ctx.beginPath()
    ctx.moveTo(W * 0.05, railY + 22)
    ctx.lineTo(W * 0.95, railY + 22)
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Ground hatch marks
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1
    for (let gx = W * 0.05; gx <= W * 0.95; gx += 20) {
      ctx.beginPath()
      ctx.moveTo(gx, railY + 22)
      ctx.lineTo(gx - 8, railY + 30)
      ctx.stroke()
    }

    // Rail
    ctx.beginPath()
    ctx.moveTo(W * 0.05, railY)
    ctx.lineTo(W * 0.95, railY)
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 3
    ctx.stroke()

    if (!point) {
      ctx.resetTransform()
      return
    }

    const cartScreenX = W / 2 + point.x * pxPerMeter
    const cartW = 60
    const cartH = 28

    // Cart wheels
    const wheelR = 8
    const wheelY = railY + 2
    ctx.fillStyle = '#334155'
    for (const wx of [cartScreenX - 18, cartScreenX + 18]) {
      ctx.beginPath()
      ctx.arc(wx, wheelY, wheelR, 0, Math.PI * 2)
      ctx.fill()
    }

    // Cart body
    ctx.fillStyle = '#3b82f6'
    ctx.strokeStyle = '#1d4ed8'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(cartScreenX - cartW / 2, railY - cartH - wheelR, cartW, cartH, 5)
    ctx.fill()
    ctx.stroke()

    // Rod pivot point
    const pivotX = cartScreenX
    const pivotY = railY - cartH - wheelR

    // Rod
    const rodLength = pendulumLength * pxPerMeter * 2.2
    const bobX = pivotX + rodLength * Math.sin(point.theta)
    const bobY = pivotY - rodLength * Math.cos(point.theta)

    ctx.beginPath()
    ctx.moveTo(pivotX, pivotY)
    ctx.lineTo(bobX, bobY)
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.stroke()

    // Bob
    const bobR = 10
    ctx.beginPath()
    ctx.arc(bobX, bobY, bobR, 0, Math.PI * 2)
    ctx.fillStyle = '#ef4444'
    ctx.strokeStyle = '#b91c1c'
    ctx.lineWidth = 2
    ctx.fill()
    ctx.stroke()

    // Pivot circle
    ctx.beginPath()
    ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2)
    ctx.fillStyle = '#1e293b'
    ctx.fill()

    ctx.resetTransform()
  }, [point, pendulumLength, xRange])

  // Resize observer to re-draw when container size changes
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      // Force reset to trigger full redraw on next point update
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
