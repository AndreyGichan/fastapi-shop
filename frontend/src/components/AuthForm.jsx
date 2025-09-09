import { useState } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { authAPI } from '../lib/api'

export function AuthForm({ mode = 'login', onSuccess, onSwitchMode }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (mode === 'register') {
                // Валидация регистрации
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Пароли не совпадают')
                }
                if (formData.password.length < 6) {
                    throw new Error('Пароль должен содержать минимум 6 символов')
                }

                const userData = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }

                const response = await authAPI.register(userData)
                // После успешной регистрации автоматически логинимся
                const loginResponse = await authAPI.login(formData.email, formData.password)
                localStorage.setItem('access_token', loginResponse.access_token)
                onSuccess?.()
            } else {
                // Логин
                const response = await authAPI.login(formData.email, formData.password)
                localStorage.setItem('access_token', response.access_token)
                onSuccess?.()
            }
        } catch (err) {
            setError(err.message || 'Произошла ошибка')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 border">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {mode === 'login' ? 'Вход в аккаунт' : 'Создание аккаунта'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {mode === 'login'
                            ? 'Введите свои данные для входа'
                            : 'Заполните форму для регистрации'
                        }
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {mode === 'register' && (
                        <div className="space-y-2">
                            <Label htmlFor="username">Имя пользователя</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Введите ваше имя"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Введите пароль"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    {mode === 'register' && (
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Повторите пароль"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        {mode === 'login'
                            ? 'Ещё нет аккаунта? '
                            : 'Уже есть аккаунт? '
                        }
                        <button
                            type="button"
                            onClick={onSwitchMode}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}