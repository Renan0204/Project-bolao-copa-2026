import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  buscarUsuarioLogado,
  excluirUsuarioLogado,
  sairUsuario,
} from "../../services/usuarioService";
import { listarMeusPalpites } from "../../services/palpiteService";

type Usuario = {
  id?: number;
  nome?: string;
  email?: string;
  tipo?: string;
  avatarUrl?: string;
  pontuacaoTotal?: number;
  placaresExatos?: number;
};

export default function UsuarioScreen() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [quantidadePalpites, setQuantidadePalpites] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);

      const dadosUsuario = await buscarUsuarioLogado();
      const usuarioRecebido = dadosUsuario?.usuario ?? dadosUsuario;

      setUsuario(usuarioRecebido);

      const dadosPalpites = await listarMeusPalpites();

      if (Array.isArray(dadosPalpites)) {
        setQuantidadePalpites(dadosPalpites.length);
      } else if (dadosPalpites?.palpites && Array.isArray(dadosPalpites.palpites)) {
        setQuantidadePalpites(dadosPalpites.palpites.length);
      } else {
        setQuantidadePalpites(0);
      }
    } catch (error) {
      console.error("Erro ao carregar dados da conta:", error);
      router.replace("/login");
    } finally {
      setCarregando(false);
    }
  }

  function handleSair() {
    Alert.alert(
      "Sair da Conta",
      "Deseja realmente sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: sairDaConta,
        },
      ]
    );
  }

  async function sairDaConta() {
    try {
      await sairUsuario();
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao sair da conta:", error);
      router.replace("/login");
    }
  }

  function handleExcluirConta() {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir a sua conta? Esta ação é irreversível e perderá todos os seus palpites.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim, excluir",
          style: "destructive",
          onPress: excluirConta,
        },
      ]
    );
  }

  async function excluirConta() {
    try {
      await excluirUsuarioLogado();

      Alert.alert("Conta excluída", "A sua conta foi removida com sucesso.");
      router.replace("/login");
    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);

      const mensagem =
        error?.response?.data?.erro ||
        error?.response?.data?.mensagem ||
        error?.response?.data ||
        "Erro ao excluir conta.";

      Alert.alert("Erro", String(mensagem));
    }
  }

  const handleAlterarFoto = () => {
    Alert.alert("Funcionalidade", "A alteração de foto será tratada pela equipe mobile.");
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#15803D" />
        <Text style={styles.loadingText}>Carregando conta...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Conta</Text>

      <View style={styles.profileHeader}>
        <View style={styles.photoContainer}>
          {usuario?.avatarUrl ? (
            <Image source={{ uri: usuario.avatarUrl }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person" size={60} color="#6B7280" />
          )}
        </View>

        <TouchableOpacity onPress={handleAlterarFoto}>
          <Text style={styles.editPhotoText}>Alterar Foto Perfil</Text>
        </TouchableOpacity>

        <Text style={styles.userName}>{usuario?.nome ?? "Usuário"}</Text>
        <Text style={styles.userEmail}>{usuario?.email ?? ""}</Text>

        <TouchableOpacity
          style={styles.buttonEditProfile}
          onPress={() => router.push("/(drawer)/editarUsuario")}
        >
          <Text style={styles.buttonTextEdit}>Editar Perfil (Nome e Email)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Quantidade de Palpites</Text>
        <Text style={styles.value}>{quantidadePalpites}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Minha pontuação</Text>
        <Text style={styles.value}>{usuario?.pontuacaoTotal ?? 0}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Placares exatos</Text>
        <Text style={styles.value}>{usuario?.placaresExatos ?? 0}</Text>
      </View>

      <TouchableOpacity style={styles.buttonExit} onPress={handleSair}>
        <Text style={styles.buttonText}>Sair da Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDelete} onPress={handleExcluirConta}>
        <Text style={styles.buttonTextDelete}>Excluir conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#F8FAF7"
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAF7",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },

  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  editPhotoText: {
    color: "#15803D",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 3,
  },
  userEmail: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 15,
  },
  buttonEditProfile: {
    backgroundColor: "transparent",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#15803D",
  },
  buttonTextEdit: {
    color: "#15803D",
    fontSize: 14,
    fontWeight: "600",
  },

  infoBox: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#6B7280"
  },
  value: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#15803D"
  },
  
  buttonExit: {
    backgroundColor: "#15803D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDelete: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  buttonText: { 
    color: "#FFFFFF",
    fontSize: 16, 
    fontWeight: "bold" 
  },
  buttonTextDelete: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "bold",
  },
});