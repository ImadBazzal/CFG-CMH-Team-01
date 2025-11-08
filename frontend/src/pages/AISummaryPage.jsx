import React, { useState } from 'react'

const MOCK_SUMMARIES = [
  `
  You reported a score of 50 on the CLEP Biology exam. That places you in the same score band as students who typically receive 6 science credits at Metropolitan State, Northbridge University, and the MSU satellite campuses within 40 miles.

  Those institutions also award elective credit for related exams with comparable rigor—Calculus (min 50), Natural Sciences (min 50), and Human Growth & Development (min 52). If you’re targeting Biology credit, Modern States suggests pairing Biology with one of those adjacent exams to maximize transferable hours at the schools above.
  `,
  `
  With a 58 on CLEP American Government, you qualify for 3 political science credits at Brighton College and Lakeside State, and both schools apply the credit toward their Civics core. The registrar cohort also flagged History of the US I (min 56) and Intro to Sociology (min 53) as “momentum exams” that map to the same general-ed block, so stacking those can unlock up to 9 total humanities credits at the same institutions.
  `,
  `
  Scoring 63 on College Algebra mirrors the median of students who place directly into Calculus I at Riverbend University. Their registrar crosswalk shows nearby campuses (North Hills CC and Capital Metro) translating that score into 4 math credits plus an optional placement waiver. They recommend pairing your Algebra result with CLEP Precalculus (min 55) to secure a full year of math equivalency before transferring.
  `,
  `
  Your 53 in CLEP Spanish places you in the top 30% of language submissions to Westbrook College. They automatically grant 6 lower-division credits and note that the same proficiency opens “fast-track evaluation” for French/German if you test within 60 days. Advisors at three partner schools within 25 miles honor a similar policy, so you can mix-and-match language exams to fulfill the entire global studies requirement ahead of enrollment.
  `,
  `
  A 56 on CLEP Information Systems earns you 3 technology credits at Center City Tech, but the school also awards an extra elective if you submit a matching Intro to Business Law score (min 55). Their data shows students who combine those two exams with Financial Accounting (min 57) arrive with nearly one semester of the business core satisfied. Campuses in the same consortium (North Loop Tech + Prairie Ridge) mirror that policy.
  `,
  `
  The 61 you achieved on CLEP Natural Sciences unlocks 6 lab-science credits at Horizon University and its satellite campuses. Their advising note indicates students with that score typically pass the campus chemistry challenge exam, freeing them to tackle upper-division STEM courses earlier. If you add Human Growth & Development (min 54) and Analyzing & Interpreting Literature (min 55), Horizon will classify you as “STEM-complete” for the general education block.
  `
].map(summary => summary.trim())

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
              const randomSummary = MOCK_SUMMARIES[Math.floor(Math.random() * MOCK_SUMMARIES.length)]
              setSummary(randomSummary)
              setHasGenerated(true)
            }}
          >
            {hasGenerated ? 'Generate Another Summary' : 'Generate Summary'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default AISummaryPage
