import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function ProtectedRoute({ children }) {
    const navigate = useNavigate()
    const token = localStorage.getItem('access_token')

    useEffect(() => {
        if (!token) {
            navigate('/auth')
        }
    }, [token, navigate])

    if (!token) {
        return null // или лоадер
    }

    return children
}