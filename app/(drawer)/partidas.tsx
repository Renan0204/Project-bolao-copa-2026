import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
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
      console.error("Erro ao carregar partidas:", error);
    } finally {
      setCarregando(false);
    }
  }

  const abrirDetalhes = (partidaId: number) => {
    router.push({
      pathname: '/(drawer)/detalhesPartida',
      params: { partidaId: String(partidaId) }
    });
  };

  const formatarUrlImagem = (url: string | null | undefined) => {
    if (!url) return undefined;
    
    if (url.startsWith("http")) {
      return url;
    }
    
    return `http://10.0.2.2:8080${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const renderItem = ({ item }: { item: Partida }) => (
    <View style={styles.card}>
      <View style={styles.matchRow}>
        
        <View style={styles.teamContainer}>
          {item.selecaoABandeiraUrl ? (
            <Image 
              source={{ uri: formatarUrlImagem(item.selecaoABandeiraUrl) }} 
              style={styles.flag} 
            />
          ) : (
            <View style={styles.flagPlaceholder} />
          )}
          <Text style={styles.teamName}>{item.selecaoA}</Text> 
        </View>

        <Text style={styles.versusText}>X</Text>

        <View style={styles.teamContainer}>
          {item.selecaoBBandeiraUrl ? (
            <Image 
              source={{ uri: formatarUrlImagem(item.selecaoBBandeiraUrl) }} 
              style={styles.flag} 
            />
          ) : (
            <View style={styles.flagPlaceholder} />
          )}
          <Text style={styles.teamName}>{item.selecaoB}</Text>
        </View>

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
      <Text style={styles.title}>Partidas</Text>
      <Text style={styles.filters}>Fase | Data | Status</Text>

      <Text style={styles.section}>Listagem Geral</Text>
      <FlatList
        data={partidas}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma partida encontrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  filters: { fontSize: 16, color: '#555', marginBottom: 20 },
  section: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center'
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    width: 45,
    height: 30,
    borderRadius: 4, 
    marginBottom: 8,
    resizeMode: 'cover', 
  },
  flagPlaceholder: {
    width: 45,
    height: 30,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginBottom: 8,
  },
  teamName: { 
    fontSize: 16, 
    fontWeight: 'bold',
    textAlign: 'center'
  },
  versusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 20, color: '#777' }
});