import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { listarMeusPalpites } from "../../services/palpiteService";

import { Palpite } from "../../types/palpite";
import PalpiteCard from "../../componentes/PalpiteCard";

export default function PalpitesScreen() {
  const router = useRouter();

  const [palpites, setPalpites] = useState<Palpite[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarPalpites();
    }, [])
  );

  async function carregarPalpites(exibirLoading = true) {
    try {
      if (exibirLoading) setCarregando(true);
      const dados = await listarMeusPalpites();

      if (Array.isArray(dados)) {
        setPalpites(dados);
        return;
      }

      if (dados?.palpites && Array.isArray(dados.palpites)) {
        setPalpites(dados.palpites);
        return;
      }

      setPalpites([]);
    } catch (error) {
      console.error("Erro ao carregar meus palpites:", error);
    } finally {
      if (exibirLoading) setCarregando(false);
    }
  }

  async function atualizarDados() {
    try {
      setAtualizando(true);
      await carregarPalpites(false);
    } finally {
      setAtualizando(false);
    }
  }

  function partidaDisputada(item: Palpite) {
    if (!item.partida?.dataHora) {
      return true;
    }

    const dataPartida = new Date(item.partida.dataHora).getTime();
    const agora = new Date().getTime();

    return (
      agora >= dataPartida ||
      item.partida.status === "Finalizada" ||
      item.partida.status === "Em Andamento"
    );
  }

  function editarPalpite(partidaId: number) {
    router.push({
      pathname: "/(drawer)/fazerPalpite",
      params: { partidaId: String(partidaId) },
    });
  }

  const palpitesADisputar = palpites.filter((p) => !partidaDisputada(p));
  const palpitesDisputados = palpites.filter((p) => partidaDisputada(p));

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#15803D" />
        <Text style={styles.loadingText}>Carregando palpites...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={atualizarDados}
          colors={["#15803D"]}
        />
      }
    >
      <Text style={styles.title}>Meus Palpites</Text>

      <Text style={styles.section}>A disputar</Text>
      {palpitesADisputar.length > 0 ? (
        palpitesADisputar.map((item) => (
          <PalpiteCard 
            key={item.id} 
            item={item} 
            isDisputada={false} 
            onEdit={editarPalpite} 
          />
        ))
      ) : (
        <Text style={styles.emptyText}>Nenhum palpite a disputar.</Text>
      )}

      <Text style={styles.section}>Disputado</Text>
      {palpitesDisputados.length > 0 ? (
        palpitesDisputados.map((item) => (
          <PalpiteCard 
            key={item.id} 
            item={item} 
            isDisputada={true} 
            onEdit={editarPalpite} 
          />
        ))
      ) : (
        <Text style={styles.emptyText}>Nenhum palpite disputado.</Text>
      )}
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAF7",
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
  },
  section: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
    color: "#111827",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
});