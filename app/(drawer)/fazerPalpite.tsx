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
import { registrarPalpite } from "../../services/palpiteService";

type Partida = {
  id: number;
  selecaoA: string;
  selecaoB: string;
  dataHora: string;
  fase: string;
  grupo: string;
  estadio: string;
  status: string;
};

export default function FazerPalpiteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const partidaId = Number(params.partidaId);

  const [partida, setPartida] = useState<Partida | null>(null);
  const [golsSelecaoA, setGolsSelecaoA] = useState("");
  const [golsSelecaoB, setGolsSelecaoB] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarPartida();
  }, []);

  async function carregarPartida() {
    try {
      setCarregando(true);

      if (!partidaId) {
        Alert.alert("Erro", "Partida não informada.");
        router.replace("/(drawer)/home");
        return;
      }

      const dados = await buscarPartidaPorId(partidaId);
      setPartida(dados);
    } catch (error) {
      console.error("Erro ao carregar partida:", error);
      Alert.alert("Erro", "Não foi possível carregar a partida.");
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

      const resposta = await registrarPalpite(partida.id, golsA, golsB);

      console.log("PALPITE REGISTRADO:", resposta);

      Alert.alert("Sucesso", "Palpite registrado com sucesso!");

      router.replace("/(drawer)/palpites");
    } catch (error: any) {
      console.error("Erro ao registrar palpite:", error);

      const mensagem =
        error?.response?.data?.erro ||
        "Não foi possível registrar o palpite.";

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
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando partida...</Text>
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
      <Text style={styles.title}>Fazer Palpite</Text>

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

      <View style={styles.palpiteRow}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>{partida.selecaoA}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={golsSelecaoA}
            onChangeText={setGolsSelecaoA}
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
            onChangeText={setGolsSelecaoB}
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
          {salvando ? "Salvando..." : "Registrar Palpite"}
        </Text>
      </TouchableOpacity>
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
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  matchTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
    textAlign: "center",
  },
  statusText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    marginTop: 8,
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
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#f2f2f2",
  },
  xText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonPrimary: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});