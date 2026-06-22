import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Modal,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
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

type TipoFiltro = 'fase' | 'data' | 'status';

export default function PartidasScreen() {
  const router = useRouter();

  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const [filtros, setFiltros] = useState({ fase: '', data: '', status: '' });
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('fase');

  async function carregarPartidas(exibirLoading = true) {
    try {
      if (exibirLoading) setCarregando(true);
      const dados = await buscarPartidas();
      setPartidas(dados || []);
    } catch (error) {
      console.error('Erro ao carregar partidas:', error);
    } finally {
      if (exibirLoading) setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarPartidas();
    }, [])
  );

  async function atualizarPartidas() {
    try {
      setAtualizando(true);
      await carregarPartidas(false);
    } finally {
      setAtualizando(false);
    }
  }

  function formatarData(dataHora: string) {
    if (!dataHora) return 'Não informada';
    const data = new Date(dataHora);
    return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  function formatarUrlImagem(url: string | null | undefined) {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `http://10.0.2.2:8080${url.startsWith('/') ? '' : '/'}${url}`;
  }

  const opcoesModal = useMemo(() => ({
    fase: ['', ...new Set(partidas.map((p) => p.fase).filter(Boolean))],
    data: ['', ...new Set(partidas.map((p) => formatarData(p.dataHora)).filter(Boolean))],
    status: ['', ...new Set(partidas.map((p) => p.status).filter(Boolean))],
  }), [partidas]);

  const partidasFiltradas = useMemo(() => {
    return partidas.filter((p) => {
      const faseOk = filtros.fase ? p.fase === filtros.fase : true;
      const dataOk = filtros.data ? formatarData(p.dataHora) === filtros.data : true;
      const statusOk = filtros.status ? p.status === filtros.status : true;
      return faseOk && dataOk && statusOk;
    });
  }, [partidas, filtros]);

  function abrirModal(tipo: TipoFiltro) {
    setTipoFiltro(tipo);
    setModalAberto(true);
  }

  function selecionarOpcao(valor: string) {
    setFiltros((prev) => ({ ...prev, [tipoFiltro]: valor }));
    setModalAberto(false);
  }

  function abrirDetalhesPartida(partidaId: number) {
    router.push({
      pathname: '/(drawer)/detalhesPartida',
      params: { partidaId: String(partidaId) },
    });
  }

  const renderItem = ({ item }: { item: Partida }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.flagsRow}>
          {item.selecaoABandeiraUrl ? (
            <Image source={{ uri: formatarUrlImagem(item.selecaoABandeiraUrl) }} style={styles.flag} />
          ) : (
            <View style={styles.flagPlaceholder} />
          )}

          {item.selecaoBBandeiraUrl ? (
            <Image source={{ uri: formatarUrlImagem(item.selecaoBBandeiraUrl) }} style={styles.flag} />
          ) : (
            <View style={styles.flagPlaceholder} />
          )}
        </View>

        <Text style={styles.matchText}>{item.selecaoA} x {item.selecaoB}</Text>
        <Text style={styles.dateText}>{formatarData(item.dataHora)}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => abrirDetalhesPartida(item.id)}>
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

  const filtrosBotoes: { key: TipoFiltro; label: string }[] = [
    { key: 'fase', label: 'Fase' },
    { key: 'data', label: 'Data' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={partidasFiltradas}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizarPartidas} colors={['#15803D']} />}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Partidas</Text>
            <View style={styles.filtersContainer}>
              {filtrosBotoes.map(({ key, label }) => (
                <TouchableOpacity key={key} style={styles.filterBtn} onPress={() => abrirModal(key)}>
                  <Text style={styles.filterText} numberOfLines={1}>
                    {filtros[key] || label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.section}>Listagem Geral</Text>
          </>
        }
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma partida encontrada.</Text>}
      />

      <Modal visible={modalAberto} transparent animationType="fade" onRequestClose={() => setModalAberto(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalAberto(false)}>
          <View style={styles.modalContent}>
            {opcoesModal[tipoFiltro].map((opcao) => (
              <TouchableOpacity key={opcao || 'todos'} style={styles.modalOption} onPress={() => selecionarOpcao(opcao)}>
                <Text style={styles.modalOptionText}>{opcao || 'Todos'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#111827',
  },
  filtersContainer: {
    marginBottom: 10,
  },
  filterBtn: {
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
    fontSize: 14,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
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
    marginBottom: 10,
  },
  flag: {
    width: 40,
    height: 28,
    resizeMode: 'contain',
    borderRadius: 4,
    marginHorizontal: 5,
  },
  flagPlaceholder: {
    width: 40,
    height: 28,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
    marginHorizontal: 5,
  },
  matchText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  dateText: {
    marginTop: 6,
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#111827',
    textAlign: 'center',
  },
});