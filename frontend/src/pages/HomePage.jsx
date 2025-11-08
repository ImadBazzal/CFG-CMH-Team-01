import React from 'react'
import Navbar from '../components/Navbar'
import Searchbar from '../components/Searchbar'

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen px-6 pb-28 pt-20 text-center bg-gray-100">
        <section className="space-y-3 max-w-2xl">
          <h1 className="text-3xl font-semibold text-slate-900 md:text-[2.75rem]">
            CLEP Acceptance Tool
          </h1>
        </section>

        {/* Add margin-top to create space */}
        <div className="mt-8">
          <Searchbar />
        </div>
      </main>
    </>
  )
}

export default HomePage