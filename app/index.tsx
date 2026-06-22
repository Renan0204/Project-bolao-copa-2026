import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { buscarPartidas } from "../services/partidaService";

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

  return `http://10.0.2.2:8080${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function IndexScreen() {
  const router = useRouter();

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
      if (exibirLoading) {
        setCarregando(true);
      }

      const partidasApi = await buscarPartidas();

      const proximasPartidas = (partidasApi ?? []).filter(
        (p: Partida) => p.status !== "Finalizada"
      );

      setPartidas(proximasPartidas);
    } catch (error) {
      console.error("Erro ao carregar partidas públicas:", error);
    } finally {
      if (exibirLoading) {
        setCarregando(false);
      }
    }
  }

  async function atualizarDados() {
    try {
      setAtualizando(true);
      await carregarDados(false);
    } finally {
      setAtualizando(false);
    }
  }

  function irParaLogin() {
    router.push("/login");
  }

  function renderizarCardPartida(partida: Partida) {
    return (
      <TouchableOpacity
        key={partida.id}
        style={styles.cardPartida}
        activeOpacity={0.8}
        onPress={irParaLogin}
      >
        <View style={styles.flagsRow}>
          {partida.selecaoABandeiraUrl ? (
            <Image
              source={{
                uri: formatarUrlImagem(partida.selecaoABandeiraUrl),
              }}
              style={styles.flag}
            />
          ) : (
            <View style={styles.flagPlaceholder} />
          )}

          {partida.selecaoBBandeiraUrl ? (
            <Image
              source={{
                uri: formatarUrlImagem(partida.selecaoBBandeiraUrl),
              }}
              style={styles.flag}
            />
          ) : (
            <View style={styles.flagPlaceholder} />
          )}
        </View>

        <Text style={styles.matchText}>
          {partida.selecaoA} x {partida.selecaoB}
        </Text>
      </TouchableOpacity>
    );
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#15803D" />
        <Text style={styles.loadingText}>Carregando jogos...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={atualizarDados}
          colors={["#15803D"]}
        />
      }
    >
      <View style={styles.topArea}>
        <TouchableOpacity style={styles.acessarButton} onPress={irParaLogin}>
          <Text style={styles.acessarText}>Acessar</Text>
        </TouchableOpacity>

        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.tabsRow}>
        <TouchableOpacity style={styles.tabButtonFull} onPress={irParaLogin}>
          <Text style={styles.tabText}>Ranking</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listaPartidas}>
        {partidas.length > 0 ? (
          partidas.slice(0, 3).map((partida) => renderizarCardPartida(partida))
        ) : (
          <View style={styles.cardPartida}>
            <Text style={styles.matchText}>Nenhuma partida programada</Text>
          </View>
        )}

        <TouchableOpacity style={styles.fazerPalpiteButton} onPress={irParaLogin}>
          <Text style={styles.fazerPalpiteText}>Faça seu palpite!</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF7",
  },

  contentContainer: {
    paddingTop: 30,
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

  topArea: {
    minHeight: 145,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  acessarButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#15803D",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },

  acessarText: {
    color: "#15803D",
    fontSize: 14,
    fontWeight: "600",
  },

  logo: {
    width: 95,
    height: 95,
  },

  tabsRow: {
    marginBottom: 20,
  },

  tabButtonFull: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },

  listaPartidas: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 4,
  },

  cardPartida: {
    height: 110,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 4,
    marginBottom: 14,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 12,
  },

  flagsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  flag: {
    width: 38,
    height: 26,
    resizeMode: "contain",
    borderRadius: 3,
    marginHorizontal: 5,
  },

  flagPlaceholder: {
    width: 38,
    height: 26,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginHorizontal: 5,
  },

  matchText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },

  fazerPalpiteButton: {
    backgroundColor: "#15803D",
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  fazerPalpiteText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});