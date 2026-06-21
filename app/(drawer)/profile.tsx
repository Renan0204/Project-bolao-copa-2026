import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertHelper } from "../../utils/AlertHelper";
import {
  buscarUsuarioLogado,
  excluirUsuarioLogado,
  sairUsuario,
} from "../../services/usuarioService";

type Usuario = {
  id?: number;
  nome?: string;
  email?: string;
  tipo?: string;
  avatarUrl?: string;
  pontuacaoTotal?: number;
  placaresExatos?: number;
};

export default function ProfileScreen() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    try {
      setCarregando(true);

      const dados = await buscarUsuarioLogado();
      const usuarioRecebido = dados?.usuario ?? dados;

      setUsuario(usuarioRecebido);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      AlertHelper.error("Não foi possível carregar o perfil.");
      router.replace("/login");
    } finally {
      setCarregando(false);
    }
  }

  function irParaEditarPerfil() {
    router.push("/(drawer)/editarUsuario");
  }

  async function onSairPress() {
    try {
      await sairUsuario();
      AlertHelper.success("Logout realizado com sucesso.");
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
      AlertHelper.error("Erro ao sair da conta.");
    }
  }

  function confirmarLogout() {
    Alert.alert("Sair da conta", "Deseja realmente sair da sua conta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: onSairPress,
      },
    ]);
  }

  function confirmarExcluirConta() {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta permanentemente?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: onExcluirContaPress,
        },
      ],
    );
  }

  async function onExcluirContaPress() {
    try {
      await excluirUsuarioLogado();
      AlertHelper.error("Conta excluída.");
      router.replace("/login");
    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);

      const mensagem =
        error?.response?.data?.erro ||
        error?.response?.data?.mensagem ||
        error?.response?.data ||
        "Erro ao excluir conta.";

      AlertHelper.error(String(mensagem));
    }
  }

  if (carregando) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri:
              usuario?.avatarUrl ||
              "https://avatars.githubusercontent.com/u/106830297?v=4",
          }}
          style={styles.profileImage}
        />

        <Text style={styles.textName}>{usuario?.nome ?? "Usuário"}</Text>
        <Text style={styles.textEmail}>{usuario?.email ?? ""}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Tipo</Text>
          <Text style={styles.infoValue}>{usuario?.tipo ?? "USER"}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Pontuação</Text>
          <Text style={styles.infoValue}>
            {usuario?.pontuacaoTotal ?? 0} pts
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Placares exatos</Text>
          <Text style={styles.infoValue}>{usuario?.placaresExatos ?? 0}</Text>
        </View>

        <TouchableOpacity
          style={styles.buttonEditar}
          onPress={irParaEditarPerfil}
        >
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSair} onPress={confirmarLogout}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonExcluir}
          onPress={confirmarExcluirConta}
        >
          <Text style={styles.buttonText}>Excluir Conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: "100%",
    maxWidth: 340,
  },
  textName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  textEmail: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  buttonEditar: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  buttonSair: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonExcluir: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
