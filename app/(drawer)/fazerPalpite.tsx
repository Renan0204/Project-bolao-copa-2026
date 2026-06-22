// app/(drawer)/fazerPalpite.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { buscarPartidaPorId } from "../../services/partidaService";
import { registrarPalpite, listarMeusPalpites } from "../../services/palpiteService";

// Importando os tipos centralizados!
import { Partida } from "../../types/partida";
import { Palpite } from "../../types/palpite";

export default function FazerPalpiteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const partidaId = Number(params.partidaId);

  const [partida, setPartida] = useState<Partida | null>(null);
  const [palpiteExistente, setPalpiteExistente] = useState<Palpite | null>(null);
  const [golsSelecaoA, setGolsSelecaoA] = useState("");
  const [golsSelecaoB, setGolsSelecaoB] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [partidaId]);

  async function carregarDados() {
    try {
      setCarregando(true);
      
      // Limpeza dos estados para evitar o efeito "Fantasma"
      setPartida(null);
      setPalpiteExistente(null);
      setGolsSelecaoA("");
      setGolsSelecaoB("");

      if (!partidaId) {
        Alert.alert("Erro", "Partida não informada.");
        router.replace("/(drawer)/home");
        return;
      }

      const dadosPartida = await buscarPartidaPorId(partidaId);
      setPartida(dadosPartida);

      const dadosPalpites = await listarMeusPalpites();

      let listaPalpites: Palpite[] = [];

      if (Array.isArray(dadosPalpites)) {
        listaPalpites = dadosPalpites;
      } else if (dadosPalpites?.palpites && Array.isArray(dadosPalpites.palpites)) {
        listaPalpites = dadosPalpites.palpites;
      }

      const palpiteDaPartida = listaPalpites.find(
        (palpite) => Number(palpite.partida?.id) === partidaId
      );

      if (palpiteDaPartida) {
        setPalpiteExistente(palpiteDaPartida);
        setGolsSelecaoA(String(palpiteDaPartida.golsSelecaoA));
        setGolsSelecaoB(String(palpiteDaPartida.golsSelecaoB));
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados do palpite.");
    } finally {
      setCarregando(false);
    }
  }

  async function enviarPalpite() {
    if (!partida) {
      Alert.alert("Erro", "Partida não carregada.");
      return;
    }

    if (golsSelecaoA === "" || golsSelecaoB === "") {
      Alert.alert("Atenção", "Informe os gols das duas seleções.");
      return;
    }

    const golsA = Number(golsSelecaoA);
    const golsB = Number(golsSelecaoB);

    if (Number.isNaN(golsA) || Number.isNaN(golsB)) {
      Alert.alert("Atenção", "Informe apenas números nos campos de gols.");
      return;
    }

    if (golsA < 0 || golsB < 0) {
      Alert.alert("Atenção", "Os gols não podem ser negativos.");
      return;
    }

    try {
      setSalvando(true);

      await registrarPalpite(partida.id, golsA, golsB);

      if (palpiteExistente) {
        Alert.alert("Sucesso", "Palpite atualizado com sucesso!");
      } else {
        Alert.alert("Sucesso", "Palpite registrado com sucesso!");
      }

      router.replace("/(drawer)/palpites");
    } catch (error: any) {
      const mensagem =
        error?.response?.data?.erro ||
        error?.response?.data?.mensagem ||
        "Não foi possível salvar o palpite.";

      Alert.alert("Erro", mensagem);
    } finally {
      setSalvando(false);
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

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#15803D" />
        <Text style={styles.loadingText}>Carregando palpite...</Text>
      </View>
    );
  }

  if (!partida) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Partida não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {palpiteExistente ? "Editar Palpite" : "Fazer Palpite"}
      </Text>

      <View style={styles.card}>
        <Text style={styles.matchTitle}>
          {partida.selecaoA} x {partida.selecaoB}
        </Text>
        <Text style={styles.infoText}>{partida.fase}</Text>
        <Text style={styles.infoText}>{partida.grupo}</Text>
        <Text style={styles.infoText}>{partida.estadio}</Text>
        <Text style={styles.infoText}>{formatarData(partida.dataHora)}</Text>
        <Text style={styles.statusText}>Status: {partida.status}</Text>
      </View>

      {palpiteExistente && (
        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>
            Você já palpitou nessa partida. Altere o placar abaixo para editar.
          </Text>
        </View>
      )}

      <View style={styles.palpiteRow}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>{partida.selecaoA}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={golsSelecaoA}
            onChangeText={(texto) => setGolsSelecaoA(texto.replace(/[^0-9]/g, ""))}
            placeholder="0"
          />
        </View>

        <Text style={styles.xText}>x</Text>

        <View style={styles.inputBox}>
          <Text style={styles.label}>{partida.selecaoB}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={golsSelecaoB}
            onChangeText={(texto) => setGolsSelecaoB(texto.replace(/[^0-9]/g, ""))}
            placeholder="0"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={enviarPalpite}
        disabled={salvando}
      >
        <Text style={styles.buttonText}>
          {salvando
            ? "Salvando..."
            : palpiteExistente
            ? "Atualizar Palpite"
            : "Registrar Palpite"}
        </Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  matchTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#111827",
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
    textAlign: "center",
  },
  statusText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  noticeCard: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#F59E0B",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  noticeText: {
    color: "#991B1B",
    fontSize: 14,
    textAlign: "center",
  },
  palpiteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  inputBox: {
    width: "40%",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    color: "#111827",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#FFFFFF",
    color: "#111827",
  },
  xText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6B7280",
  },
  buttonPrimary: {
    backgroundColor: "#15803D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});