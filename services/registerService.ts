import { api } from "./api";

export async function registrar(nome: string, email: string, senha: string) {
  const response = await api.post("/api/auth/cadastrar", {
    nome,
    email,
    senha,
  });

  return response.data;
}