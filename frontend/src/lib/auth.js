// src/lib/auth.js
const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: email, password }), // OAuth2PasswordRequestForm ожидает поля username & password
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  const data = await res.json();
  // сохраняем токен в localStorage
  console.log("LOGIN RESPONSE:", data);
  localStorage.setItem('token', data.access_token);
  return data;
}

export async function logout() {
  localStorage.removeItem('token');
}

export async function register({ username, email, password }) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json(); // возвращает созданного пользователя
}
