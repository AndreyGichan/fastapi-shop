import { useState } from 'react'
import { Header } from '../components/Header'
import { AuthForm } from '../components/AuthForm'
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/')
  }

  const handleSwitchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4">
        <AuthForm 
          mode={mode}
          onSuccess={handleSuccess}
          onSwitchMode={handleSwitchMode}
        />
      </main>
    </div>
  )
}