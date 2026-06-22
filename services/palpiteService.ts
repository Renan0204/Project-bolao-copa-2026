import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";
import { Palpite } from "../types/palpite";
import { mapearPartidaDTO } from "./partidaService";

function mapearPalpiteDTO(item: any): Palpite {
  return {
    id: item.id,
    golsSelecaoA: item.golsSelecaoA,
    golsSelecaoB: item.golsSelecaoB,
    pontos: item.pontos,
    criterioPontuacao: item.criterioPontuacao,
    criadoEm: item.criadoEm,
    partida: item.partida ? mapearPartidaDTO(item.partida) : undefined,
  };
}

export async function registrarPalpite(
  partidaId: number,
  golsSelecaoA: number,
  golsSelecaoB: number
): Promise<Palpite> {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("Token não encontrado.");
  }

  const response = await api.post(
    `/api/palpites/partida/${partidaId}`,
    {
      golsSelecaoA,
      golsSelecaoB,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return mapearPalpiteDTO(response.data);
}

export async function listarMeusPalpites(): Promise<Palpite[]> {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("Token não encontrado.");
  }

  const response = await api.get("/api/palpites/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let dadosBrutos = [];
  
  if (Array.isArray(response.data)) {
    dadosBrutos = response.data;
  } else if (response.data?.palpites && Array.isArray(response.data.palpites)) {
    dadosBrutos = response.data.palpites;
  }

  return dadosBrutos.map(mapearPalpiteDTO);
}