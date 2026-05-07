import { useTranslation } from 'react-i18next'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden rounded-[34px] bg-[#f5f5f7] px-5 py-8 shadow-[0_0_0_1px_rgba(180,180,180,0.28)] md:px-8 md:py-12 lg:px-10 lg:py-14">
      <div aria-hidden="true" className="home-hero-grid absolute inset-0 opacity-80" />
      <div aria-hidden="true" className="home-hero-scan absolute inset-x-0 top-0 h-32 opacity-70" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(0,113,227,0.12),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.9),rgba(245,245,247,0.72)_55%,rgba(210,210,215,0.36))]" />

      <div className="relative grid min-h-[520px] gap-8 md:grid-cols-[minmax(0,1fr)_minmax(320px,430px)] md:items-center">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold tracking-[-0.014em] text-primary">
            {t('heroEyebrow')}
          </p>
          <h2 className="text-5xl font-semibold leading-[1.04] tracking-[-0.02em] text-[#1d1d1f] md:text-7xl">
            {t('heroTitle')}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-7 text-muted-foreground md:text-xl">
            {t('heroSubtitle')}
          </p>
        </div>

        <div className="relative">
          <div aria-hidden="true" className="home-signal-line absolute -left-8 top-10 hidden h-px w-24 bg-gradient-to-r from-transparent via-[#0071e3] to-transparent md:block" />
          <div className="rounded-[28px] bg-[#1d1d1f] p-4 text-white shadow-[0_24px_70px_rgba(29,29,31,0.26),0_0_0_1px_rgba(40,40,40,0.8)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-white/56">{t('workspaceStatus')}</p>
                <p className="mt-1 text-2xl font-semibold tracking-[-0.015em]">
                  {t('readyToRun')}
                </p>
              </div>
              <div className="flex h-9 items-center gap-1.5 rounded-full bg-white/8 px-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                <span className="size-2 rounded-full bg-[#30d158]" />
                <span className="text-xs font-medium text-white/68">online</span>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[18px] bg-white/[0.06] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                <div className="mb-3 flex items-center justify-between text-xs text-white/48">
                  <span>CAS</span>
                  <span>12 ms</span>
                </div>
                <pre className="overflow-hidden font-mono text-sm leading-6 text-white/86">
                  <code>{'diff(sin(x), x)\n=> cos(x)'}</code>
                </pre>
              </div>

              <div className="rounded-[18px] bg-white p-4 text-[#1d1d1f] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                <div className="mb-4 flex items-center justify-between text-xs text-[#6e6e73]">
                  <span>simulation</span>
                  <span>stable</span>
                </div>
                <div className="flex h-28 items-end gap-2">
                  {[34, 58, 46, 76, 64, 88, 70, 96].map((height, index) => (
                    <div
                      key={height}
                      className="home-bar w-full rounded-t-md bg-[#0071e3]"
                      style={{
                        height: `${height}%`,
                        animationDelay: `${index * 80}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
