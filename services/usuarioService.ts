import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

async function buscarToken() {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("Token não encontrado.");
  }

  return token;
}

export async function buscarUsuarioLogado() {
  const token = await buscarToken();

  const response = await api.get("/api/usuarios/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function atualizarUsuarioLogado(dados: {
  nome?: string;
  email?: string;
  avatarUrl?: string;
}) {
  const token = await buscarToken();

  const response = await api.put(
    "/api/usuarios/me",
    {
      nome: dados.nome,
      email: dados.email,
      avatarUrl: dados.avatarUrl,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function sairUsuario() {
  const token = await buscarToken();

  try {
    const response = await api.post(
      "/api/usuarios/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } finally {
    await AsyncStorage.removeItem("token");
  }
}

export async function excluirUsuarioLogado() {
  const token = await buscarToken();

  try {
    const response = await api.delete("/api/usuarios/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } finally {
    await AsyncStorage.removeItem("token");
  }
}