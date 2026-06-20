import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { buscarUsuarioLogado } from "../../services/usuarioService";

export default function HomeScreen() {
  const router = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    try {
      console.log("CHAMANDO buscarUsuarioLogado...");

      const dados = await buscarUsuarioLogado();

      console.log("DADOS RECEBIDOS NA HOME:", dados);

      if (dados?.nome) {
        setNomeUsuario(dados.nome);
        return;
      }

      if (dados?.usuario?.nome) {
        setNomeUsuario(dados.usuario.nome);
        return;
      }

      console.log("Nome do usuário não encontrado na resposta:", dados);
    } catch (error) {
      console.error("Erro ao buscar usuário logado:", error);
      router.replace("/login");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Olá, {nomeUsuario}</Text>

      <View style={styles.drawnRow}>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Próximas {"\n"}partidas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Ranking {"\n"}resumido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Pontuação {"\n"}atual</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuredCard}>
        <Text style={styles.matchText}>Brasil x Haiti</Text>
        <TouchableOpacity
          style={styles.palpitarButton}
          onPress={() => router.push("/(drawer)/detalhesPartida")}
        >
          <Text style={styles.palpitarText}>palpitar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Palpitar</Text>

      <View style={styles.gridRow}>
        <View style={styles.smallCard}>
          <Text style={styles.smallMatchText}>México x África</Text>
          <TouchableOpacity
            style={styles.palpitarButton}
            onPress={() => router.push("/(drawer)/detalhesPartida")}
          >
            <Text style={styles.palpitarText}>palpitar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.smallMatchText}>Japão x EUA</Text>
          <TouchableOpacity
            style={styles.palpitarButton}
            onPress={() => router.push("/(drawer)/detalhesPartida")}
          >
            <Text style={styles.palpitarText}>palpitar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  drawnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tabButton: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "32%",
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  featuredCard: {
    backgroundColor: "#FFF",
    paddingVertical: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    borderRadius: 5,
  },
  matchText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  palpitarButton: {
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 5,
  },
  palpitarText: {
    fontWeight: "bold",
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  smallCard: {
    backgroundColor: "#FFF",
    width: "48%",
    paddingVertical: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  smallMatchText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
});