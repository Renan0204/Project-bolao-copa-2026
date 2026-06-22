import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { buscarUsuarioLogado } from "../../services/usuarioService";
import { buscarPartidas } from "../../services/partidaService";

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
};

function formatarUrlImagem(url: string | null | undefined) {
  if (!url) return undefined;

  if (url.startsWith("http")) return url;

  return `http://10.0.2.2:8080${
    url.startsWith("/") ? "" : "/"
  }${url}`;
}

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
      console.log("Usuário sem token, redirecionando para login..."); 
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
      style={destaque ? styles.featuredContainer : styles.smallContainer}
    >
      <View
        style={destaque ? styles.featuredCard : styles.smallCard}
      >
        <View style={styles.flagsRow}>
          {partida.selecaoABandeiraUrl ? (
            <Image
              source={{
                uri: formatarUrlImagem(
                  partida.selecaoABandeiraUrl
                ),
              }}
              style={styles.flag}
            />
          ) : (
            <View style={styles.flagPlaceholder} />
          )}

          {partida.selecaoBBandeiraUrl ? (
            <Image
              source={{
                uri: formatarUrlImagem(
                  partida.selecaoBBandeiraUrl
                ),
              }}
              style={styles.flag}
            />
          ) : (
            <View style={styles.flagPlaceholder} />
          )}
        </View>

        <Text
          style={destaque ? styles.matchText : styles.smallMatchText}
        >
          {partida.selecaoA} x {partida.selecaoB}
        </Text>
      </View>

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
    justifyContent: "center",
  },

  tabText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    color: "#111827",
  },

  featuredContainer: {
    marginBottom: 20,
  },

  featuredCard: {
    height: 140,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
    marginBottom: 6,
  },

  matchText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#111827",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
    textAlign: "center",
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
    height: 110,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
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