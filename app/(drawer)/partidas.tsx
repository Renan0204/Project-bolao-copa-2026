import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { buscarPartidas } from '../../services/partidaService';

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

export default function PartidasScreen() {
  const router = useRouter();
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPartidas();
  }, []);

  async function carregarPartidas() {
    try {
      setCarregando(true);
      const dados = await buscarPartidas();
      setPartidas(dados || []);
    } catch (error) {
      console.error("Erro ao carregar partidas:", error);
    } finally {
      setCarregando(false);
    }
  }

  const abrirDetalhes = (partidaId: number) => {
    router.push({
      pathname: "/(drawer)/detalhesPartida",
      params: { partidaId: String(partidaId) },
    });
  };

  const renderItem = ({ item }: { item: Partida }) => (
    <View style={styles.card}>
      <Text style={styles.match}>
        {item.selecaoA} x {item.selecaoB}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => abrirDetalhes(item.id)}
      >
        <Text style={styles.buttonText}>detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Partidas</Text>
      <Text style={styles.filters}>Fase | Data | Status</Text>

      <Text style={styles.section}>Listagem Geral</Text>
      <FlatList
        data={partidas}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma partida encontrada.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  containerCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  filters: { fontSize: 16, color: "#555", marginBottom: 20 },
  section: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  match: { fontSize: 18, fontWeight: "bold" },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 20, color: "#777" },
});
