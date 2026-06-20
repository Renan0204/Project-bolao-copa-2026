import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

export async function registrarPalpite(
  partidaId: number,
  golsSelecaoA: number,
  golsSelecaoB: number
) {
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

  return response.data;
}

export async function listarMeusPalpites() {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("Token não encontrado.");
  }

  const response = await api.get("/api/palpites/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}