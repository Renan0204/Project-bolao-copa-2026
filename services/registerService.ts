import { api } from "./api";

export async function registrar(name: string, email: string, senha: string) {
    // --- MODO DESENVOLVIMENTO (MOCK) ---
    // Descomente a linha abaixo para ignorar a API enquanto ela estiver fora do ar:
    // return { id: 1, name: "Usuário Teste", email: email };

    // --- MODO PRODUÇÃO (REAL) ---
    try {
        const resposta = await api.post("/auth/customer/register", {
            name: name,
            email: email,
            password: senha
        });

        return resposta.data;
    } catch (error) {
        console.error("Erro no Registro:", error);
        throw error; // Propaga o erro para o componente tratar
    }
}