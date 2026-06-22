import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { buscarPartidas } from "../../services/partidaService";
import { buscarUsuarioLogado } from "../../services/usuarioService";
import { Partida } from "../../types/partida";
import PartidaCard from "../../componentes/PartidaCard";

function normalizarStatus(status: string) {
  return status?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export default function HomeScreen() {
  const router = useRouter();

  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erroConexao, setErroConexao] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados(exibirLoading = true) {
    try {
      if (exibirLoading) setCarregando(true);
      setErroConexao(false);

      const usuario = await buscarUsuarioLogado();
      const partidasApi = await buscarPartidas();

      setNomeUsuario(usuario?.nome ?? usuario?.usuario?.nome ?? "Usuário");
      setPartidas(partidasApi ?? []);
    } catch {
      setErroConexao(true);
    } finally {
      if (exibirLoading) setCarregando(false);
    }
  }

  async function atualizarDados() {
    setAtualizando(true);
    await carregarDados(false);
    setAtualizando(false);
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

  function ehFinalizada(partida: Partida) {
    return normalizarStatus(partida.status).includes("finalizad");
  }

  const partidaDestaque = useMemo(() => {
    const emAndamento = partidas.find(ehEmAndamento);
    if (emAndamento) return emAndamento;
    return partidas.find((p) => !ehEmAndamento(p) && !ehFinalizada(p));
  }, [partidas]);

  const demaisPartidas = useMemo(() => {
    return partidas.filter((partida) => {
      const isDestaque = partidaDestaque && partida.id === partidaDestaque.id;
      const isTerminada = ehFinalizada(partida);
      return !isDestaque && !isTerminada;
    });
  }, [partidas, partidaDestaque]);

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#15803D" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  if (erroConexao) {
    return (
      <ScrollView
        contentContainerStyle={styles.errorContainer}
        refreshControl={
          <RefreshControl refreshing={atualizando} onRefresh={atualizarDados} colors={["#15803D"]} />
        }
      >
        <Text style={styles.errorTitle}>Ops! Falha na conexão.</Text>
        <Text style={styles.errorText}>Não foi possível carregar os jogos.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => carregarDados(true)}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={atualizando} onRefresh={atualizarDados} colors={["#15803D"]} />
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
        <PartidaCard 
          partida={partidaDestaque} 
          destaque={true} 
          onPress={() => abrirDetalhesPartida(partidaDestaque.id)} 
        />
      ) : (
        <View style={styles.featuredContainer}>
          <View style={styles.featuredCard}>
            <Text style={styles.matchText}>Nenhuma partida agendada</Text>
          </View>
        </View>
      )}

      {demaisPartidas.length > 0 && (
        <Text style={styles.sectionTitle}>Próximos jogos</Text>
      )}

      <View style={styles.gridRow}>
        {demaisPartidas.length > 0 ? (
          demaisPartidas.map((partida) => (
            <PartidaCard 
              key={partida.id}
              partida={partida} 
              onPress={() => abrirDetalhesPartida(partida.id)} 
            />
          ))
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
  errorContainer: {
    flex: 1,
    backgroundColor: "#F8FAF7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#DC2626",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 5,
  },
  retryButton: {
    backgroundColor: "#15803D",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
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
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    width: "100%",
    marginTop: 10,
  },
  featuredContainer: {
    marginBottom: 20,
    width: "100%",
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
  matchText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
  }
});