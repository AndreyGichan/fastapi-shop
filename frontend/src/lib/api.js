// src/lib/api.js
const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token'); // или где ты хранишь токен
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Ошибка ответа сервера:", text);
    let json = null;
    try { json = JSON.parse(text); } catch(e) { }
    const err = json?.detail || text || res.statusText;
    const error = new Error(err);
    error.status = res.status;
    throw error;
  }

  // если 204 No Content
  if (res.status === 204) return null;
  return res.json();

  
}

export async function getCart() {
  return apiFetch('/cart');
}

export async function deleteCartItem(itemId) {
  return apiFetch(`/cart/${itemId}`, { method: 'DELETE' });
}

export async function clearCart() {
  return apiFetch('/cart', { method: 'DELETE' });
}

export async function updateCartItem(itemId, quantity) {
  return apiFetch(`/cart/${itemId}?quantity=${quantity}`, { method: 'PUT' });
}


export async function getCurrentUser() {
  return apiFetch('/users/me');
}

export async function updateCurrentUser(data) {
  return apiFetch('/users/me', {
    method: 'PUT',
    body: data,
  });
}

export async function deleteCurrentUser() {
  return apiFetch('/users/me', { method: 'DELETE' });
}

export async function getUsers() {
  return apiFetch('/users');
}

export async function updateUserByAdmin(id, data) {
  return apiFetch(`/users/${id}`, {
    method: 'PUT',
    body: data,
  });
}

// Для админа: удалить пользователя
export async function deleteUserByAdmin(id) {
  return apiFetch(`/users/${id}`, { method: 'DELETE' });
}
