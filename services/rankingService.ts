import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

export async function buscarRankingGeral() {
  const response = await api.get("/api/ranking?page=0&size=50");
  return response.data;
}

export async function buscarMinhaPosicaoRanking() {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("Token não encontrado.");
  }

  const response = await api.get("/api/ranking/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}