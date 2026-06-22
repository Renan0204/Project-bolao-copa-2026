import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { buscarPartidas } from '../../services/partidaService';

type Partida = {
  id: number;
  selecaoA: string;
  selecaoABandeiraUrl?: string | null;
  selecaoB: string;
  selecaoBBandeiraUrl?: string | null;
  golsSelecaoA?: number;
  golsSelecaoB?: number;
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

  useFocusEffect(
    useCallback(() => {
      carregarPartidas();
    }, [])
  );

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

  function statusContem(statusReal: string, palavraBuscada: string) {
    if (!statusReal) return false;
    const limpo = statusReal.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    return limpo.includes(palavraBuscada);
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

  // Separando em três categorias agora
  const partidasEmAndamento = partidasFiltradas.filter((p) => statusContem(p.status, 'andamento'));
  const partidasAgendadas = partidasFiltradas.filter((p) => statusContem(p.status, 'agend'));
  const partidasFinalizadas = partidasFiltradas.filter((p) => statusContem(p.status, 'finalizad')); // Pega 'finalizada' ou 'finalizadas'
  
  const nenhumaPartida = partidasEmAndamento.length === 0 && partidasAgendadas.length === 0 && partidasFinalizadas.length === 0;

  function abrirModal(tipo: TipoFiltro) {
    setTipoFiltro(tipo);
    setModalAberto(true);
  }

  function selecionarOpcao(valor: string) {
    setFiltros({ ...filtros, [tipoFiltro]: valor });
    setModalAberto(false);
  }

  function renderizarCardPartida(item: Partida) {
    // Se está em andamento OU finalizada, nós mostramos o placar (se existir)
    const mostrarPlacar = (statusContem(item.status, 'andamento') || statusContem(item.status, 'finalizad')) && 
                          item.golsSelecaoA !== undefined && item.golsSelecaoB !== undefined &&
                          item.golsSelecaoA !== null && item.golsSelecaoB !== null;

    return (
      <View key={item.id} style={styles.card}>
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

          {mostrarPlacar ? (
            <Text style={styles.matchTextScore}>
              {item.selecaoA}  <Text style={styles.scoreText}>{item.golsSelecaoA ?? 0}</Text> x <Text style={styles.scoreText}>{item.golsSelecaoB ?? 0}</Text>  {item.selecaoB}
            </Text>
          ) : (
             <Text style={styles.matchText}>{item.selecaoA} x {item.selecaoB}</Text>
          )}
          
          <Text style={styles.dateText}>{formatarData(item.dataHora)}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/(drawer)/detalhesPartida', params: { partidaId: String(item.id) } })}>
          <Text style={styles.buttonText}>detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderizarGrupo(titulo: string, lista: Partida[]) {
    if (lista.length === 0) return null;
    return (
      <View style={styles.groupContainer}>
        <Text style={styles.section}>{titulo}</Text>
        <View style={styles.cardsGrid}>
          {lista.map(renderizarCardPartida)}
        </View>
      </View>
    );
  }

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
    { key: 'status', label: 'Status' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizarPartidas} colors={['#15803D']} />}
      >
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

        {/* Agora renderizamos as três categorias */}
        {renderizarGrupo('Em Andamento', partidasEmAndamento)}
        {renderizarGrupo('Agendados', partidasAgendadas)}
        {renderizarGrupo('Finalizadas', partidasFinalizadas)}

        {nenhumaPartida && <Text style={styles.empty}>Nenhuma partida encontrada.</Text>}

        <View style={{ height: 40 }} />
      </ScrollView>

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
  groupContainer: {
    marginTop: 8,
  },
  section: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 15,
    color: '#111827',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  matchTextScore: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803D',
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