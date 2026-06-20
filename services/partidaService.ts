import { api } from "./api";

export async function buscarPartidas() {
  const response = await api.get("/api/partidas");
  return response.data;
}

export async function buscarPartidaPorId(id: number) {
  const response = await api.get(`/api/partidas/${id}`);
  return response.data;
}