import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { buscarPartidas } from "../../services/partidaService";
import { buscarUsuarioLogado } from "../../services/usuarioService";

type Partida = {
  id: number;
  selecaoA: string;
  selecaoABandeiraUrl?: string | null;
  selecaoB: string;
  selecaoBBandeiraUrl?: string | null;
  dataHora: string;
  fase: string;
  grupo: string;
  estadio: string;
  status: string;
  golsSelecaoA?: number | null;
  golsSelecaoB?: number | null;
};

const API_URL = "http://10.0.2.2:8080";

function formatarUrlImagem(url?: string | null) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function normalizarStatus(status: string) {
  return status?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export default function HomeScreen() {
  const router = useRouter();

  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados(exibirLoading = true) {
    try {
      if (exibirLoading) setCarregando(true);

      const usuario = await buscarUsuarioLogado();
      const partidasApi = await buscarPartidas();

      setNomeUsuario(usuario?.nome ?? usuario?.usuario?.nome ?? "Usuário");
      setPartidas(partidasApi ?? []);
    } catch {
      router.replace("/login");
    } finally {
      if (exibirLoading) setCarregando(false);
    }
  }

  async function atualizarDados() {
    setAtualizando(true);
    await carregarDados(false);
    setAtualizando(false);
  }

  function formatarData(dataHora: string) {
    if (!dataHora) return "Data não informada";

    const data = new Date(dataHora);

    return `${data.toLocaleDateString("pt-BR")} às ${data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  function abrirDetalhesPartida(partidaId: number) {
    router.push({
      pathname: "/(drawer)/detalhesPartida",
      params: { partidaId: String(partidaId) },
    });
  }

  function ehEmAndamento(partida: Partida) {
    return normalizarStatus(partida.status).includes("andamento");
  }

  function temPlacar(partida: Partida) {
    return partida.golsSelecaoA != null && partida.golsSelecaoB != null;
  }

  function renderBandeiras(partida: Partida) {
    return (
      <View style={styles.flagsRow}>
        {partida.selecaoABandeiraUrl ? (
          <Image source={{ uri: formatarUrlImagem(partida.selecaoABandeiraUrl) }} style={styles.flag} />
        ) : (
          <View style={styles.flagPlaceholder} />
        )}

        {partida.selecaoBBandeiraUrl ? (
          <Image source={{ uri: formatarUrlImagem(partida.selecaoBBandeiraUrl) }} style={styles.flag} />
        ) : (
          <View style={styles.flagPlaceholder} />
        )}
      </View>
    );
  }

  function renderizarCardPartida(partida: Partida, destaque = false) {
    const emAndamento = ehEmAndamento(partida);
    const mostrarPlacar = destaque && emAndamento && temPlacar(partida);

    return (
      <View key={partida.id} style={destaque ? styles.featuredContainer : styles.smallContainer}>
        <View style={destaque ? styles.featuredCard : styles.smallCard}>
          {destaque && emAndamento && (
            <Text style={styles.statusEmAndamento}>Em andamento</Text>
          )}

          {renderBandeiras(partida)}

          {mostrarPlacar ? (
            <Text style={destaque ? styles.matchText : styles.smallMatchText}>
              {partida.selecaoA}  <Text style={styles.scoreText}>{partida.golsSelecaoA}</Text> x <Text style={styles.scoreText}>{partida.golsSelecaoB}</Text>  {partida.selecaoB}
            </Text>
          ) : (
            <Text style={destaque ? styles.matchText : styles.smallMatchText}>
              {partida.selecaoA} x {partida.selecaoB}
            </Text>
          )}

          <Text style={styles.dateText}>{formatarData(partida.dataHora)}</Text>
        </View>

        <TouchableOpacity
          style={styles.palpitarButton}
          onPress={() => abrirDetalhesPartida(partida.id)}
        >
          <Text style={styles.palpitarText}>
            {destaque && emAndamento ? "detalhes" : "palpitar"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const partidaDestaque = useMemo(() => {
    return partidas.find(ehEmAndamento) ?? partidas[0];
  }, [partidas]);

  const demaisPartidas = useMemo(() => {
    return partidaDestaque
      ? partidas.filter((partida) => partida.id !== partidaDestaque.id)
      : [];
  }, [partidas, partidaDestaque]);

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#15803D" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={atualizarDados}
          colors={["#15803D"]}
        />
      }
    >
      <Text style={styles.greeting}>Olá, {nomeUsuario}</Text>

      <View style={styles.drawnRow}>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push("/(drawer)/partidas")}>
          <Text style={styles.tabText}>Partidas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => router.push("/(drawer)/ranking")}>
          <Text style={styles.tabText}>Ranking</Text>
        </TouchableOpacity>
      </View>

      {partidaDestaque ? (
        renderizarCardPartida(partidaDestaque, true)
      ) : (
        <View style={styles.featuredContainer}>
          <View style={styles.featuredCard}>
            <Text style={styles.matchText}>Nenhuma partida cadastrada</Text>
          </View>
        </View>
      )}

      {demaisPartidas.length > 0 && (
        <Text style={styles.sectionTitle}>Próximos jogos</Text>
      )}

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
    backgroundColor: "#F8FAF7",
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAF7",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
  },

  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
    textAlign: "center",
  },

  drawnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  tabButton: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    width: "48%",
    alignItems: "center",
  },

  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },

  featuredContainer: {
    marginBottom: 20,
  },

  featuredCard: {
    minHeight: 125,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 6,
  },

  statusEmAndamento: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#15803D",
    marginBottom: 8,
    textTransform: "uppercase",
  },

  matchText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
  },

  scoreText: {
    color: "#15803D",
    fontWeight: "bold",
  },

  dateText: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginTop: 4,
  },

  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40,
  },

  smallContainer: {
    width: "48%",
    marginBottom: 15,
  },

  smallCard: {
    height: 140,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 6,
  },

  smallMatchText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 5,
    color: "#111827",
  },

  palpitarButton: {
    backgroundColor: "#15803D",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#15803D",
  },

  palpitarText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  flagsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  flag: {
    width: 40,
    height: 28,
    resizeMode: "contain",
    borderRadius: 4,
    marginHorizontal: 5,
  },

  flagPlaceholder: {
    width: 40,
    height: 28,
    backgroundColor: "#D1D5DB",
    borderRadius: 4,
    marginHorizontal: 5,
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    width: "100%",
    marginTop: 10,
  },
});