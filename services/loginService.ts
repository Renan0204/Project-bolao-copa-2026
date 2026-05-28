import { api } from "./api";

type LoginResposta = {
    id: number;
    name: string;
    email: string;
    token: string;
}

export async function logar(email: string, senha: string) {
    const resposta = await api.post<LoginResposta>("/auth/customer/login", {
        email: email,
        password: senha
    })

    if (resposta.status === 200) {
        return resposta.data.token;
    }

    throw new Error("Status desconhecido:" + resposta.status)
}