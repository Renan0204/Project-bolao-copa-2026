// services/loginService.ts
// Não precisamos importar a 'api' se não vamos usá-la agora
export async function logar(email: string, senha: string) {
  // 1. Simula um atraso de 1 segundo (opcional, para parecer real)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 2. Retorna um token falso imediatamente
  // Isso fará o seu login.tsx acreditar que o login foi bem-sucedido
  return "token-de-teste-acesso-liberado";
}
