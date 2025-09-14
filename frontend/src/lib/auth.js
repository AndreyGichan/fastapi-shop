const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || 'Ошибка логина');
  }
  localStorage.setItem('token', data.access_token);

  const meRes = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  });

  if (!meRes.ok) {
    const text = await meRes.text();
    throw new Error(text || meRes.statusText);
  }

  const user = await meRes.json();
  localStorage.setItem('role', user.role);

  return { ...data, role: user.role };
}

export async function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}

export async function register({ username, email, password }) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || res.statusText);
  }

  return data;
}
