import React from 'react'
import Searchbar from '../components/Searchbar'

const HomePage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 pb-28 pt-24 text-center bg-gray-100">
      <section className="space-y-3 max-w-2xl">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-[2.75rem]">
          CLEP Acceptance Tool
        </h1>
      </section>

      <div className="mt-8 w-full max-w-4xl">
        <Searchbar />
      </div>
    </main>
  )
}

export default HomePage
