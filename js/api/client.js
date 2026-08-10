import { API_BASE } from "./config.js";

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Cliente HTTP mínimo contra HogarAP.
 * @param {string} path - Ruta relativa, ej. "/api/mascotas"
 * @param {RequestInit & { body?: object }} [options]
 */
export async function apiRequest(path, options = {}) {
  const { body, headers, ...rest } = options;

  const config = {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (data &&
        typeof data === "object" &&
        (data.message || data.detail || data.error || data.title)) ||
      `Error HTTP ${response.status} en ${path}`;
    throw new ApiError(String(message), response.status, data);
  }

  return data;
}
