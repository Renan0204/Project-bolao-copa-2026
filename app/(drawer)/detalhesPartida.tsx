import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { buscarPartidaPorId } from "../../services/partidaService";

import { Partida } from "../../types/partida";

function normalizarStatus(status: string) {
  return status?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() || "";
}

export default function DetalhesPartidaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const partidaId = Number(params.partidaId);

  const [partida, setPartida] = useState<Partida | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPartida();
  }, [partidaId]);

  async function carregarPartida() {
    try {
      setCarregando(true);
      setPartida(null); 

      if (!partidaId) {
        console.error("partidaId não informado.");
        return;
      }

      const dados = await buscarPartidaPorId(partidaId);
      setPartida(dados);
    } catch (error) {
      console.error("Erro ao buscar detalhes da partida:", error);
    } finally {
      setCarregando(false);
    }
  }

  function formatarData(dataHora: string) {
    if (!dataHora) return "Data não informada";
    const data = new Date(dataHora);
    return data.toLocaleDateString("pt-BR");
  }

  function formatarHora(dataHora: string) {
    if (!dataHora) return "Horário não informado";
    const data = new Date(dataHora);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function irParaFazerPalpite() {
    if (!partida) return;

    router.push({
      pathname: "/(drawer)/fazerPalpite",
      params: { partidaId: String(partida.id) },
    });
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#15803D" />
        <Text style={styles.loadingText}>Carregando partida...</Text>
      </View>
    );
  }

  if (!partida) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Partida não encontrada</Text>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => router.replace("/(drawer)/home")}
        >
          <Text style={styles.buttonText}>Voltar para Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusNorm = normalizarStatus(partida.status);
  const isFinalizada = statusNorm.includes("finalizad");
  const isEmAndamento = statusNorm.includes("andamento");
  const isAgendada = !isFinalizada && !isEmAndamento; 

  const permitePalpite = isAgendada;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Partida</Text>

      <View style={styles.header}>
        <Text style={styles.headerText}>Informações da Partida</Text>
      </View>

      <View style={styles.matchCard}>
        {(isFinalizada || isEmAndamento) && partida.golsSelecaoA != null && partida.golsSelecaoB != null ? (
           <Text style={styles.matchTitle}>
             {partida.selecaoA}  <Text style={styles.scoreHighlight}>{partida.golsSelecaoA}</Text> x <Text style={styles.scoreHighlight}>{partida.golsSelecaoB}</Text>  {partida.selecaoB}
           </Text>
        ) : (
          <Text style={styles.matchTitle}>
            {partida.selecaoA} x {partida.selecaoB}
          </Text>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Data:</Text>
        <Text style={styles.value}>{formatarData(partida.dataHora)}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Horário:</Text>
        <Text style={styles.value}>{formatarHora(partida.dataHora)}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Estádio:</Text>
        <Text style={styles.value}>{partida.estadio}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Fase:</Text>
        <Text style={styles.value}>{partida.fase}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Grupo:</Text>
        <Text style={styles.value}>{partida.grupo}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, isFinalizada && styles.statusFinalizada, isEmAndamento && styles.statusAndamento]}>
           {partida.status || "Desconhecido"}
        </Text>
      </View>

      {permitePalpite ? (
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={irParaFazerPalpite}
        >
          <Text style={styles.buttonText}>Fazer Palpite</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.disabledButtonContainer}>
          <Text style={styles.disabledButtonText}>
            {isFinalizada ? "Partida Encerrada" : "Partida em Andamento"}
          </Text>
        </View>
      )}
    </View>
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
    textAlign: "center",
    color: "#111827",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  matchCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  matchTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  scoreHighlight: {
    color: "#15803D",
    fontWeight: "900",
  },
  infoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  value: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  statusFinalizada: {
    color: "#DC2626",
    fontWeight: "bold",
  },
  statusAndamento: {
    color: "#15803D",
    fontWeight: "bold",
  },
  buttonPrimary: {
    backgroundColor: "#15803D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButtonContainer: {
    backgroundColor: "#E5E7EB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  disabledButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "bold",
  },
});