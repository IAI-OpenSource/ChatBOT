import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Connexion from './Pages/Connexion'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Connexion />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
