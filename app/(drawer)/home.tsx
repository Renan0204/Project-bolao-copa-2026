import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { buscarUsuarioLogado } from "../../services/usuarioService";
import { buscarPartidas } from "../../services/partidaService";

type Partida = {
  id: number;
  selecaoA: string;
  selecaoB: string;
  dataHora: string;
  fase: string;
  grupo: string;
  estadio: string;
  status: string;
  golsSelecaoA?: number | null;
  golsSelecaoB?: number | null;
};

export default function HomeScreen() {
  const router = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);

      const usuario = await buscarUsuarioLogado();
      const partidasApi = await buscarPartidas();

      if (usuario?.nome) {
        setNomeUsuario(usuario.nome);
      } else if (usuario?.usuario?.nome) {
        setNomeUsuario(usuario.usuario.nome);
      }

      setPartidas(partidasApi ?? []);
    } catch (error) {
      console.error("Erro ao carregar dados da Home:", error);
      router.replace("/login");
    } finally {
      setCarregando(false);
    }
  }

  function formatarData(dataHora: string) {
    if (!dataHora) {
      return "Data não informada";
    }

    const data = new Date(dataHora);

    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function abrirDetalhesPartida(partidaId: number) {
    router.push({
      pathname: "/(drawer)/detalhesPartida",
      params: { partidaId: String(partidaId) },
    });
  }

  function renderizarCardPartida(partida: Partida, destaque = false) {
    return (
      <View
        key={partida.id}
        style={destaque ? styles.featuredCard : styles.smallCard}
      >
        <Text style={destaque ? styles.matchText : styles.smallMatchText}>
          {partida.selecaoA} x {partida.selecaoB}
        </Text>

        <Text style={styles.infoText}>{partida.fase}</Text>
        <Text style={styles.infoText}>{partida.grupo}</Text>
        <Text style={styles.infoText}>{formatarData(partida.dataHora)}</Text>
        <Text style={styles.statusText}>Status: {partida.status}</Text>

        <TouchableOpacity
          style={styles.palpitarButton}
          onPress={() => abrirDetalhesPartida(partida.id)}
        >
          <Text style={styles.palpitarText}>palpitar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  const partidaDestaque = partidas[0];
  const demaisPartidas = partidas.slice(1);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Olá, {nomeUsuario}</Text>

      <View style={styles.drawnRow}>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Próximas {"\n"}partidas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push("/(drawer)/ranking")}
        >
          <Text style={styles.tabText}>Ranking</Text>
        </TouchableOpacity>
      </View>

      {partidaDestaque ? (
        renderizarCardPartida(partidaDestaque, true)
      ) : (
        <View style={styles.featuredCard}>
          <Text style={styles.matchText}>Nenhuma partida cadastrada</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Palpitar</Text>

      <View style={styles.gridRow}>
        {demaisPartidas.length > 0 ? (
          demaisPartidas.map((partida) => renderizarCardPartida(partida))
        ) : (
          <Text style={styles.emptyText}>Nenhuma outra partida disponível.</Text>
        )}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
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
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  featuredCard: {
    backgroundColor: "#FFF",
    paddingVertical: 30,
    paddingHorizontal: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    borderRadius: 5,
  },
  matchText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
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
    marginTop: 10,
  },
  palpitarText: {
    fontWeight: "bold",
  },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  smallCard: {
    backgroundColor: "#FFF",
    width: "48%",
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  smallMatchText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  infoText: {
    fontSize: 11,
    color: "#555",
    textAlign: "center",
  },
  statusText: {
    fontSize: 11,
    color: "#333",
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    width: "100%",
    marginTop: 10,
  },
});