import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { AlertHelper } from "../../utils/AlertHelper";
import {
  buscarUsuarioLogado,
  atualizarUsuarioLogado,
} from "../../services/usuarioService";

type Usuario = {
  id?: number;
  nome?: string;
  email?: string;
  avatarUrl?: string;
};

export default function EditarUsuarioScreen() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    try {
      setCarregando(true);

      const dados = await buscarUsuarioLogado();

      const usuarioRecebido = dados?.usuario ?? dados;

      setUsuario(usuarioRecebido);
      setNome(usuarioRecebido?.nome ?? "");
      setEmail(usuarioRecebido?.email ?? "");
      setAvatarUrl(usuarioRecebido?.avatarUrl ?? "");
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      AlertHelper.error("Não foi possível carregar os dados do usuário.");
      router.replace("/login");
    } finally {
      setCarregando(false);
    }
  }

  async function handleSalvar() {
    if (!nome || !email) {
      AlertHelper.warning("Nome e e-mail devem ser preenchidos.");
      return;
    }

    try {
      setSalvando(true);

      await atualizarUsuarioLogado({
        nome,
        email,
        avatarUrl,
      });

      AlertHelper.success("Perfil atualizado com sucesso!");
      router.back();
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);

      const mensagem =
        error?.response?.data?.erro ||
        error?.response?.data?.mensagem ||
        error?.response?.data ||
        "Erro ao salvar alterações.";

      AlertHelper.error(String(mensagem));
    } finally {
      setSalvando(false);
    }
  }

  function handleCancelar() {
    router.back();
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome de exibição</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite o seu nome"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite o seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>URL do Avatar</Text>
        <TextInput
          style={styles.input}
          value={avatarUrl}
          onChangeText={setAvatarUrl}
          placeholder="Digite a URL do avatar"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleSalvar}
          disabled={salvando}
        >
          <Text style={styles.buttonText}>
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={handleCancelar}
        >
          <Text style={styles.buttonTextSecondary}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  form: {
    flex: 1,
    justifyContent: "flex-start",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#666",
  },
  buttonTextSecondary: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
});
