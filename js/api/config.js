/**
 * Base URL del backend Spring Boot (HogarAP).
 * Usa el mismo host con el que se abrió el frontend, de modo que también
 * funciona desde celulares y otros equipos de la red local.
 */
const backendHost = window.location.hostname || "localhost";

export const API_BASE = `http://${backendHost}:8080`;
