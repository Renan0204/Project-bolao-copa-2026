import { api, BASE_URL } from "./api";
import { Partida } from "../types/partida";

function formatarUrlImagem(url?: string | null) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function mapearPartidaDTO(item: any): Partida {
  return {
    id: item.id,
    selecaoA: item.selecaoA,
    selecaoB: item.selecaoB,
    selecaoABandeiraUrl: formatarUrlImagem(item.selecaoABandeiraUrl),
    selecaoBBandeiraUrl: formatarUrlImagem(item.selecaoBBandeiraUrl),
    dataHora: item.dataHora,
    fase: item.fase,
    grupo: item.grupo,
    estadio: item.estadio,
    status: item.status || "Agendado",
    golsSelecaoA: item.golsSelecaoA,
    golsSelecaoB: item.golsSelecaoB,
  };
}

export async function buscarPartidas(): Promise<Partida[]> {
  const response = await api.get("/api/partidas");
  
  if (response.data && Array.isArray(response.data)) {
    return response.data.map(mapearPartidaDTO);
  }
  
  return [];
}

export async function buscarPartidaPorId(id: number): Promise<Partida> {
  const response = await api.get(`/api/partidas/${id}`);
  return mapearPartidaDTO(response.data);
}