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
        <ActivityIndicator size="large" color="#007AFF" />
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
    backgroundColor: '#fff',
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
  },

  filter: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
  },

  filterText: {
    color: '#555',
  },

  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 15,
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
    borderColor: '#D9D9D9',
    borderRadius: 12,
    backgroundColor: '#fff',
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
    backgroundColor: '#eee',
    borderRadius: 4,
    marginHorizontal: 5,
  },

  matchText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },

  button: {
    marginTop: 6,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
});