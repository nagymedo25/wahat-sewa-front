import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setApiAuthToken(token) {
  if (token) {
    publicApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete publicApi.defaults.headers.common.Authorization;
}

export function buildAvatarUrl(name) {
  const normalized = encodeURIComponent(name || 'Wahat Sewa');
  return `https://ui-avatars.com/api/?name=${normalized}&background=4A5A2A&color=F5EFE3&bold=true&size=128`;
}
