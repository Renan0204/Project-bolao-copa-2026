import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { listarMeusPalpites } from "../../services/palpiteService";

type Palpite = {
  id: number;
  golsSelecaoA: number;
  golsSelecaoB: number;
  pontos?: number;
  criterioPontuacao?: string;
  criadoEm?: string;
  partida?: {
    id?: number;
    selecaoA?: string;
    selecaoB?: string;
    dataHora?: string;
    status?: string;
    fase?: string;
    grupo?: string;
    estadio?: string;
    golsSelecaoA?: number | null;
    golsSelecaoB?: number | null;
  };
};

export default function PalpitesScreen() {
  const router = useRouter();

  const [palpites, setPalpites] = useState<Palpite[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPalpites();
  }, []);

  async function carregarPalpites() {
    try {
      setCarregando(true);
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
      setCarregando(false);
    }
  }

  function partidaDisputada(item: Palpite) {
    return item.partida?.status === "Finalizada";
  }

  function obterNomePartida(item: Palpite) {
    const selecaoA = item.partida?.selecaoA ?? "-";
    const selecaoB = item.partida?.selecaoB ?? "-";

    return `${selecaoA} x ${selecaoB}`;
  }

  function obterPlacarPalpite(item: Palpite) {
    return `${item.golsSelecaoA} x ${item.golsSelecaoB}`;
  }

  function editarPalpite(item: Palpite) {
    if (!item.partida?.id) {
      return;
    }

    router.push({
      pathname: "/(drawer)/fazerPalpite",
      params: { partidaId: String(item.partida.id) },
    });
  }

  const renderPalpite = ({ item }: { item: Palpite }) => (
    <View style={styles.card}>
      <Text style={styles.match}>{obterNomePartida(item)}</Text>

      <Text style={styles.palpite}>
        Seu palpite: {obterPlacarPalpite(item)}
      </Text>

      <Text style={styles.status}>
        Status: {item.partida?.status ?? "Não informado"}
      </Text>

      {partidaDisputada(item) && (
        <View style={styles.result}>
          <Text style={styles.placar}>
            Placar oficial: {item.partida?.golsSelecaoA ?? "-"} x{" "}
            {item.partida?.golsSelecaoB ?? "-"}
          </Text>

          <Text style={styles.pontos}>
            +{item.pontos ?? 0} pontos
          </Text>

          {item.criterioPontuacao && (
            <Text style={styles.criterio}>{item.criterioPontuacao}</Text>
          )}
        </View>
      )}

      {!partidaDisputada(item) && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => editarPalpite(item)}
        >
          <Text style={styles.buttonText}>Editar Palpite</Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
    <View style={styles.container}>
      <Text style={styles.title}>Meus Palpites</Text>

      <Text style={styles.section}>A disputar</Text>

      <FlatList
        data={palpitesADisputar}
        renderItem={renderPalpite}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum palpite a disputar.</Text>
        }
      />

      <Text style={styles.section}>Disputado</Text>

      <FlatList
        data={palpitesDisputados}
        renderItem={renderPalpite}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum palpite disputado.</Text>
        }
      />
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
    color: "#111827"
  },
  section: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginTop: 15, 
    marginBottom: 10,
    color: "#111827"
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  match: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 5,
    color: "#111827"
  },
  palpite: { 
    fontSize: 16, 
    marginBottom: 5,
    color: "#6B7280"
  },
  status: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 5,
  },
  result: { 
    marginTop: 5 
  },
  placar: { 
    fontSize: 14, 
    color: "#6B7280"
  },
  pontos: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#16A34A"
  },
  criterio: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },
  button: {
    backgroundColor: "#15803D",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { 
    color: "#FFFFFF",
    fontWeight: "bold" 
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center"
  },
});