// Stub — implement when POST /api/simulations/ball-and-beam endpoint is ready.
// Expected data shape: { t, r, r_dot, alpha, alpha_dot }

interface BallAndBeamDataPoint {
  t: number
  r: number       // ball position along beam (m)
  r_dot: number   // ball velocity (m/s)
  alpha: number   // beam angle (rad)
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
  void point
  void beamLength

  return (
    <div className={className ?? 'flex h-48 w-full items-center justify-center rounded-md border border-dashed'}>
      <p className="text-sm text-muted-foreground">Ball &amp; Beam — coming soon</p>
    </div>
  )
}