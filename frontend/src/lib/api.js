const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = options.body instanceof FormData
    ? { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    : {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body instanceof FormData
      ? options.body
      : options.body
        ? JSON.stringify(options.body)
        : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    console.error("Ошибка ответа сервера:", text);
    let json = null;
    try { json = JSON.parse(text); } catch (e) { }
    const err = json?.detail || text || res.statusText;
    const error = new Error(err);
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) return null;
  return res.json();

}

export async function getCart() {
  return apiFetch('/cart');
}

export async function addToCart(productId, quantity = 1) {
  return apiFetch('/products/cart', {
    method: 'POST',
    body: { product_id: productId, quantity },
  });
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

export async function changePassword(currentPassword, newPassword) {
  return apiFetch('/users/me/password', {
    method: 'PUT',
    body: {
      current_password: currentPassword,
      new_password: newPassword
    }
  });
}


export async function deleteCurrentUser() {
  return apiFetch('/users/me', { method: 'DELETE' });
}

export async function getUsers() {
  return apiFetch('/users');
}

export async function getUsersStats() {
  return apiFetch('/users/stats');
}


export async function getProducts() {
  return apiFetch('/products');
}

export async function getProductsForAdmin() {
  return apiFetch('/products/admin');
}

export async function getProduct(id) {
  return apiFetch(`/products/${id}`);
}

export async function createProduct(data) {
  return apiFetch('/products', {
    method: 'POST',
    body: data,
  });
}

export async function updateProduct(id, data) {
  return apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteProduct(id) {
  return apiFetch(`/products/${id}`, { method: 'DELETE' });
}


export async function getUserOrders() {
  return apiFetch('/orders/my_orders');
}

export async function get_orders() {
  return apiFetch('orders/get_orders')
}

export async function update_oreder_status(id) {
  return apiFetch(`/orders/${id}`, { method: 'PUT' })
}

export async function getUsersForAdmin() {
  return apiFetch('/users');
}

export async function getUserById(id) {
  return apiFetch(`/users/${id}`);
}

export async function createUserByAdmin(data) {
  return apiFetch('/users/create_user', {
    method: 'POST',
    body: data,
  });
}

export async function updateUserByAdmin(id, data) {
  return apiFetch(`/users/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteUserByAdmin(id) {
  return apiFetch(`/users/${id}`, { method: 'DELETE' });
}

export async function getOrdersForAdmin(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/orders?${query}`);
}

export async function getMyOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/orders/my_orders?${query}`);
}

export async function updateOrderStatus(orderId, data) {
  return apiFetch(`/orders/${orderId}`, {
    method: "PUT",
    body: data,
  });
}

export async function createOrder() {
  return apiFetch("/orders", { method: "POST" });
}

export async function getProductRating(productId) {
  return apiFetch(`/products/${productId}/rating`);
}

export async function submitProductRating(productId, rating) {
  return apiFetch(`/products/${productId}/review`, {
    method: "POST",
    body: { rating },
  });
}


export async function adminGenerateTempPassword(email) {
  return apiFetch("/admin/temp-password", {
    method: "POST",
    body: { email },
  });
}
