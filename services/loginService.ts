import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

export async function logar(email: string, senha: string) {
  const response = await api.post("/api/auth/login", {
    email,
    senha,
  });

  const token = response.data.token;

  if (token) {
    await AsyncStorage.setItem("token", token);
  }

  return token;
}