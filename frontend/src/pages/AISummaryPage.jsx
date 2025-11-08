import React, { useState } from 'react'

const FAKE_SUMMARY = `
You reported a score of 50 on the CLEP Biology exam. That places you in the same score band as students who typically receive 6 science credits at Metropolitan State, Northbridge University, and the MSU satellite campuses within 40 miles. 

Those institutions also award elective credit for related exams with comparable rigor—Calculus (min 50), Natural Sciences (min 50), and Human Growth & Development (min 52). If you’re targeting Biology credit, Modern States suggests pairing Biology with one of those adjacent exams to maximize transferable hours at the schools above.
`.trim()

const AISummaryPage = () => {
  const [summary, setSummary] = useState('')
  const [hasGenerated, setHasGenerated] = useState(false)

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(71,134,255,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,86,180,0.25),transparent_40%),linear-gradient(135deg,#030712,#020310_55%,#050917)] px-4 py-10 sm:px-6 lg:px-12">
      <div
        className="pointer-events-none absolute -right-[10%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(80,120,255,0.3),transparent_60%)] blur-[8px]"
        aria-hidden="true"
      />

      <section className="relative z-10 w-full max-w-3xl rounded-[32px] border border-white/10 bg-gradient-to-br from-[#070916]/90 to-[#0f1635]/80 p-8 shadow-[0_35px_65px_rgba(5,8,24,0.65)] backdrop-blur-2xl">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            Modern States
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-[2.4rem]">
            AI Summary
          </h1>
          <p className="mt-3 text-base text-white/70">
            Generate a high-level overview of the CLEP institutions you&apos;re researching.
          </p>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Summary Workspace</p>
              <h2 className="text-xl font-semibold text-white mt-1">CLEP Insights</h2>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
              Beta
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-white/5 px-5 py-8 text-white/80">
            {hasGenerated ? (
              <p className="whitespace-pre-line text-left text-base leading-relaxed text-white/90">
                {summary}
              </p>
            ) : (
              <p className="text-center text-white/60">
                Your generated summary will appear here once it&apos;s ready.
              </p>
            )}
          </div>

          <button
            type="button"
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-[#6f7dff] via-[#7f5dff] to-[#f97bff] px-6 py-3 text-base font-semibold text-white shadow-[0_18px_35px_rgba(111,125,255,0.35)] transition-all hover:-translate-y-0.5"
            onClick={() => {
              setSummary(FAKE_SUMMARY)
              setHasGenerated(true)
            }}
          >
            {hasGenerated ? 'Regenerate Summary' : 'Generate Summary'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default AISummaryPage
