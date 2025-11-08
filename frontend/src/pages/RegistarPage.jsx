import React, { useMemo, useState } from 'react'

// these are placeholder questions that we'd ask university registar affiliates 
const prompts = [
  {
    theme: 'Authorization',
    question:
      'Are you the authorized registrar or institutional representative permitted to update your school\'s CLEP credit acceptance policy?',
    description:
      'If you\'re not the designated contact, please sign in with your institutional account or request access from your registrar\'s office.',
    badge: 'Access verified',
    hints: ['Institutional access', 'Registrar approval']
  },
  {
    theme: 'Data Accuracy',
    question:
      'When was the last time your institution\'s CLEP credit policy was reviewed or updated on our platform?',
    description:
      'Regular updates help students see the most accurate credit transfer information and reduce outdated listings.',
    badge: 'Last update: 3 months ago',
    hints: ['Policy review', 'Last update log']
  },
  {
    theme: 'Coverage',
    question:
      'Which CLEP exams are currently accepted by your institution, and what are the minimum passing scores for credit?',
    description:
      'List or confirm your institution\'s accepted CLEP exams and corresponding credit policies for each department.',
    badge: '26 exams accepted',
    hints: ['Credit chart', 'Department sync']
  },
  {
    theme: 'Verification',
    question:
      'Have all departments or campuses under your institution confirmed their CLEP equivalencies?',
    description:
      'Ensure each college or branch campus within your university system has signed off on its CLEP acceptance data.',
    badge: '2 departments pending',
    hints: ['Cross-campus', 'Sign-off needed']
  },
  {
    theme: 'Maintenance',
    question:
      'Who is the current point of contact for CLEP credit policy updates this semester?',
    description:
      'Assign a primary contact to ensure any questions or discrepancies about your CLEP listings reach the right person.',
    badge: 'Contact unassigned',
    hints: ['Registrar staff', 'Update responsibility']
  }
]

const RegistarPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const activePrompt = useMemo(() => prompts[currentPrompt], [currentPrompt])

  const advancePrompt = () => {
    setCurrentPrompt((prev) => (prev + 1) % prompts.length)
  }

  const handleLogin = () => {
    if (email.trim()) {
      setIsLoggedIn(true)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(71,134,255,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,86,180,0.25),transparent_40%),linear-gradient(135deg,#030712,#020310_55%,#050917)] px-4 py-10 sm:px-6 lg:px-12">
        <div
          className="pointer-events-none absolute -right-[10%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(80,120,255,0.3),transparent_60%)] blur-[8px]"
          aria-hidden="true"
        />
        <section className="relative z-10 w-full max-w-md rounded-[32px] border border-white/10 bg-gradient-to-br from-[#070916]/90 to-[#070b20]/70 p-6 sm:p-10 lg:p-14 shadow-panel backdrop-blur-3xl">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              CREP acceptance pulse
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-[2.4rem]">
              Registrar console
            </h1>
            <p className="mt-3 text-base text-white/70">
              Sign in to manage your institution's CREP acceptance status.
            </p>
          </header>

          <div className="mt-8">
            <label htmlFor="email" className="block text-sm font-semibold text-white/80 mb-3">
              Institutional email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="registrar@university.edu"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-base text-white placeholder-white/40 transition focus:border-white/30 focus:bg-white/10 focus:outline-none"
            />
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              className="w-full rounded-full bg-gradient-to-r from-[#6f7dff] to-[#5ecfff] px-6 py-3 text-sm font-semibold text-[#020308] shadow-[0_12px_25px_rgba(94,207,255,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(94,207,255,0.35)]"
              onClick={handleLogin}
            >
              Sign in
            </button>
            <p className="text-center text-xs text-white/50">
              Proof of concept — any email will proceed
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(71,134,255,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,86,180,0.25),transparent_40%),linear-gradient(135deg,#030712,#020310_55%,#050917)] px-4 py-10 sm:px-6 lg:px-12">
      <div
        className="pointer-events-none absolute -right-[10%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(80,120,255,0.3),transparent_60%)] blur-[8px]"
        aria-hidden="true"
      />
      <section className="relative z-10 w-full max-w-4xl rounded-[32px] border border-white/10 bg-gradient-to-br from-[#070916]/90 to-[#070b20]/70 p-6 sm:p-10 lg:p-14 shadow-panel backdrop-blur-3xl">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              CREP acceptance pulse
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-[2.4rem]">
              Registrar console
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/70">
              Manage your institution's CREP acceptance status one step at a time.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm text-white/80">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/60">
              Live status
            </span>
            <strong className="text-lg font-semibold text-white">{activePrompt.badge}</strong>
          </div>
        </header>

        <section className="mt-8 flex flex-col gap-3">
          <p className="w-fit rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
            {activePrompt.theme}
          </p>
          <p className="text-2xl font-semibold leading-snug text-white sm:text-3xl">
            {activePrompt.question}
          </p>
          <p className="max-w-2xl text-base text-white/70">{activePrompt.description}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {activePrompt.hints.map((hint) => (
              <span
                key={hint}
                className="rounded-full border border-blue-200/30 bg-blue-300/15 px-4 py-1.5 text-sm text-blue-50/80"
              >
                {hint}
              </span>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div className="flex flex-1 gap-2">
            {prompts.map((_, index) => {
              const height = index === currentPrompt ? 'h-1.5' : 'h-1'
              const state =
                index === currentPrompt
                  ? 'bg-[linear-gradient(90deg,#9f7bff,#5ea5ff)]'
                  : index < currentPrompt
                  ? 'bg-blue-300/60'
                  : 'bg-white/15'
              return (
                <span
                  key={index}
                  className={`flex-1 rounded-full transition-all duration-200 ${height} ${state}`}
                />
              )
            })}
          </div>
          <p className="text-sm font-semibold tracking-[0.2em] text-white/60">
            {String(currentPrompt + 1).padStart(2, '0')} / {String(prompts.length).padStart(2, '0')}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            className="w-full rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/20 sm:w-auto"
            onClick={advancePrompt}
          >
            Remind me later
          </button>
          <button
            type="button"
            className="w-full rounded-full bg-gradient-to-r from-[#6f7dff] to-[#5ecfff] px-6 py-3 text-sm font-semibold text-[#020308] shadow-[0_12px_25px_rgba(94,207,255,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(94,207,255,0.35)] sm:w-auto"
            onClick={advancePrompt}
          >
            Next question
          </button>
        </div>
      </section>
    </main>
  )
}

export default RegistarPage
