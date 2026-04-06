export function setToken(token) {
  if (!token) return;
  localStorage.setItem("dlc_token", token);
}

export function getToken() {
  return localStorage.getItem("dlc_token");
}

export function removeToken() {
  localStorage.removeItem("dlc_token");
}

export function authHeader() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
