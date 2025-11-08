import React from 'react'
import Searchbar from '../components/Searchbar'

const HomePage = () => {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(71,134,255,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,86,180,0.25),transparent_40%),linear-gradient(135deg,#030712,#020310_55%,#050917)] px-4 py-10 sm:px-6 lg:px-12">
      <div
        className="pointer-events-none absolute -right-[10%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(80,120,255,0.3),transparent_60%)] blur-[8px]"
        aria-hidden="true"
      />

      {/* content */}
      <div className="relative z-10 w-full max-w-4xl text-center">
        <section className="space-y-3 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            Modern States
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-[2.4rem]">
            CLEP Acceptance Tool
          </h1>
          <p className="mt-3 text-base text-white/70">
            Search for institutions accepting CLEP credit
          </p>
        </section>

        <div className="mt-8 w-full">
          <Searchbar />
        </div>
      </div>
    </main>
  )
}

export default HomePage
