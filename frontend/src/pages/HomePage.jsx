import React from 'react'
import Searchbar from '../components/Searchbar'

const HomePage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 pb-28 pt-24 text-center relative overflow-hidden">
      {/* Galaxy background with multiple layers */}
      <div className="absolute inset-0 bg-black">
        {/* Nebula gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-pink-900/20 animate-pulse" 
             style={{ animationDuration: '8s' }} />
        
        {/* Moving nebula clouds */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-slow" />
        </div>

        {/* Stars - multiple layers for depth */}
        <div className="absolute inset-0">
          {/* Large bright stars */}
          {[...Array(50)].map((_, i) => (
            <div
              key={`star-large-${i}`}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                width: Math.random() * 3 + 2 + 'px',
                height: Math.random() * 3 + 2 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 3 + 2 + 's',
                boxShadow: '0 0 10px rgba(255,255,255,0.8)'
              }}
            />
          ))}
          
          {/* Small distant stars */}
          {[...Array(100)].map((_, i) => (
            <div
              key={`star-small-${i}`}
              className="absolute bg-white/60 rounded-full"
              style={{
                width: '1px',
                height: '1px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="space-y-3 max-w-2xl relative z-10">
        <h1 className="text-3xl font-semibold text-white md:text-[2.75rem] drop-shadow-lg">
          CLEP Acceptance Tool
        </h1>
        <p className="text-gray-300 text-lg">
          Explore the universe of college credit opportunities
        </p>
      </section>

      <div className="mt-8 w-full max-w-4xl relative z-10">
        <Searchbar />
      </div>

      {/* Add these animations to your index.css or tailwind config */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 30px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }
        .animate-twinkle {
          animation: twinkle infinite;
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 12s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}

export default HomePage