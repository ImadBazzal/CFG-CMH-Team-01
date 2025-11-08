import React from 'react'
import { Routes, Route } from 'react-router'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import RegistarPage from './pages/RegistarPage'
import AdminPage from './pages/AdminPage'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/registrar" element={<RegistarPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  )
}

export default App
