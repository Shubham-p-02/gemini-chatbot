const API_BASE = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || '')
  : '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return res.json();
}

export async function createChat() {
  return request('/api/chats', { method: 'POST' });
}

export async function listChats() {
  return request('/api/chats');
}

export async function getChat(chatId) {
  return request(`/api/chats/${chatId}`);
}

export async function sendMessage(chatId, message) {
  return request(`/api/chats/${chatId}/message`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function uploadFile(chatId, file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/chats/${chatId}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Upload failed (${res.status})`);
  }

  return res.json();
}

export async function deleteChat(chatId) {
  return request(`/api/chats/${chatId}`, { method: 'DELETE' });
}
