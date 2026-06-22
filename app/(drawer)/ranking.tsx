import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  buscarRankingGeral,
  buscarMinhaPosicaoRanking,
} from "../../services/rankingService";

type JogadorRanking = {
  id?: number;
  nome?: string;
  pontuacaoTotal?: number;
  placaresExatos?: number;
  posicao?: number;
  ranking?: number;
  pontos?: number;
  usuario?: {
    id?: number;
    nome?: string;
    pontuacaoTotal?: number;
    placaresExatos?: number;
  };
};

export default function RankingScreen() {
  const [ranking, setRanking] = useState<JogadorRanking[]>([]);
  const [meuRanking, setMeuRanking] = useState<JogadorRanking | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarRanking();
  }, []);

  async function carregarRanking() {
    try {
      setCarregando(true);

      const rankingGeral = await buscarRankingGeral();
      const minhaPosicao = await buscarMinhaPosicaoRanking();

      if (rankingGeral?.ranking) {
        setRanking(rankingGeral.ranking);
      }

      if (minhaPosicao) {
        setMeuRanking(minhaPosicao);
      }
    } catch (error) {
      console.error("Erro ao carregar ranking:", error);
    } finally {
      setCarregando(false);
    }
  }

  function obterPosicao(item: JogadorRanking) {
    return item.posicao ?? item.ranking ?? "-";
  }

  function obterNome(item: JogadorRanking) {
    return item.nome ?? item.usuario?.nome ?? "-";
  }

  function obterPontuacao(item: JogadorRanking) {
    return item.pontuacaoTotal ?? item.usuario?.pontuacaoTotal ?? item.pontos ?? 0;
  }

  function obterPlacaresExatos(item: JogadorRanking) {
    return item.placaresExatos ?? item.usuario?.placaresExatos ?? 0;
  }

  const renderItem = ({ item }: { item: JogadorRanking }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>
          {obterPosicao(item)}º {obterNome(item)}
        </Text>
        <Text style={styles.exatos}>
          Placares exatos: {obterPlacaresExatos(item)}
        </Text>
      </View>

      <Text style={styles.points}>{obterPontuacao(item)} pts</Text>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#15803D" />
        <Text style={styles.loadingText}>Carregando ranking...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>

      <View style={styles.myRankingCard}>
        <Text style={styles.myRankingTitle}>Meu Ranking</Text>

        {meuRanking ? (
          <>
            <Text style={styles.myRankingText}>
              {obterPosicao(meuRanking)}º {obterNome(meuRanking)} —{" "}
              {obterPontuacao(meuRanking)} pts
            </Text>
            <Text style={styles.myRankingSubText}>
              Placares exatos: {obterPlacaresExatos(meuRanking)}
            </Text>
          </>
        ) : (
          <Text style={styles.myRankingText}>
            Você ainda não está no ranking.
          </Text>
        )}
      </View>

      <FlatList
        data={ranking}
        renderItem={renderItem}
        keyExtractor={(item, index) => String(item.id ?? item.usuario?.id ?? index)}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum usuário no ranking.</Text>
        }
      />
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAF7",
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
  myRankingCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  myRankingTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#111827",
  },
  myRankingText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  myRankingSubText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  exatos: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  points: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16A34A",
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
  },
});