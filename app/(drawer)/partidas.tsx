import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { buscarPartidas } from '../../services/partidaService';

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
      console.error('Erro ao carregar partidas:', error);
    } finally {
      setCarregando(false);
    }
  }

  const abrirDetalhes = (partidaId: number) => {
    router.push({
      pathname: '/(drawer)/detalhesPartida',
      params: { partidaId: String(partidaId) },
    });
  };

  const formatarUrlImagem = (url: string | null | undefined) => {
    if (!url) return undefined;

    if (url.startsWith('http')) return url;

    return `http://10.0.2.2:8080${
      url.startsWith('/') ? '' : '/'
    }${url}`;
  };

  function formatarData(dataHora: string) {
  if (!dataHora) return "Data não informada";

  const data = new Date(dataHora);

  const dataFormatada = data.toLocaleDateString("pt-BR");

  const horaFormatada = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dataFormatada} às ${horaFormatada}`;
}

  const renderItem = ({ item }: { item: Partida }) => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <View style={styles.flagsRow}>
        {item.selecaoABandeiraUrl ? (
          <Image
            source={{
              uri: formatarUrlImagem(item.selecaoABandeiraUrl),
            }}
            style={styles.flag}
          />
        ) : (
          <View style={styles.flagPlaceholder} />
        )}

        {item.selecaoBBandeiraUrl ? (
          <Image
            source={{
              uri: formatarUrlImagem(item.selecaoBBandeiraUrl),
            }}
            style={styles.flag}
          />
        ) : (
          <View style={styles.flagPlaceholder} />
        )}
      </View>

      <Text style={styles.matchText}>
        {item.selecaoA} x {item.selecaoB}
      </Text>

      <Text style={styles.dateText}>
        {formatarData(item.dataHora)}
      </Text>
    </View>

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
        <ActivityIndicator size="large" color="#15803D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={partidas}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Partidas</Text>

            <TouchableOpacity style={styles.filter}>
              <Text style={styles.filterText}>Fase</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filter}>
              <Text style={styles.filterText}>Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filter}>
              <Text style={styles.filterText}>Status</Text>
            </TouchableOpacity>

            <Text style={styles.section}>Listagem Geral</Text>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhuma partida encontrada.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAF7',
  },

  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#111827',
  },

  filter: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },

  filterText: {
    color: '#6B7280',
  },

  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 15,
    color: '#111827',
  },

  row: {
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    marginBottom: 15,
  },

  cardContent: {
    height: 140,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },

  flagsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  flag: {
    width: 50,
    height: 35,
    resizeMode: 'contain',
    borderRadius: 4,
    marginHorizontal: 5,
  },

  flagPlaceholder: {
    width: 50,
    height: 35,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
    marginHorizontal: 5,
  },

  matchText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  dateText: {
  marginTop: 6,
  fontSize: 12,
  color: "#6B7280",
  textAlign: "center",
},

  button: {
    marginTop: 6,
    backgroundColor: '#15803D',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6B7280',
  },
});