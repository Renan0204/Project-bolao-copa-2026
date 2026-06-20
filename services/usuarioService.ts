import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

export async function buscarUsuarioLogado() {
  const token = await AsyncStorage.getItem("token");

  console.log("TOKEN SALVO:", token);

  if (!token) {
    throw new Error("Token não encontrado.");
  }

  const response = await api.get("/api/usuarios/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("RESPOSTA USUARIO LOGADO:", response.data);

  return response.data;
}