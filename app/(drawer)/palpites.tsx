import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AlertHelper } from '../utils/AlertHelper'; // importa o helper

type Partida = {
  id: string;
  timeA: string;
  timeB: string;
  palpite: string;
  disputado: boolean;
  placar?: string;
  pontos?: number;
};

const partidas: Partida[] = [
  { id: '1', timeA: 'Brasil', timeB: 'Haiti', palpite: '3 x 0', disputado: false },
  { id: '2', timeA: 'México', timeB: 'África', palpite: '1 x 0', disputado: false },
  { id: '3', timeA: 'Japão', timeB: 'EUA', palpite: '1 x 1', disputado: true, placar: '1 x 1', pontos: 10 },
  { id: '4', timeA: 'Irlanda', timeB: 'Suíça', palpite: '0 x 1', disputado: true, placar: '0 x 0', pontos: 0 },
];

export default function PalpitesScreen() {
  function registrarPalpite(item: Partida) {
    if (item.disputado) {
      AlertHelper.error("Não é mais possível registrar/editar palpites para essa partida.");
      return;
    }

    // aqui você chamaria o serviço de salvar palpite
    const sucesso = true; // simulação

    if (sucesso) {
      AlertHelper.success("Palpite registrado em 'Meus Palpites'.");
    } else {
      AlertHelper.error("Erro ao registrar palpite.");
    }
  }

  const renderPartida = ({ item }: { item: Partida }) => (
    <View style={styles.card}>
      <Text style={styles.match}>{item.timeA} x {item.timeB}</Text>
      <Text style={styles.palpite}>{item.palpite}</Text>

      {item.disputado && (
        <View style={styles.result}>
          <Text style={styles.placar}>Placar: {item.placar}</Text>
          <Text style={styles.pontos}>+{item.pontos} pontos</Text>
        </View>
      )}

      {!item.disputado && (
        <TouchableOpacity style={styles.button} onPress={() => registrarPalpite(item)}>
          <Text style={styles.buttonText}>Registrar Palpite</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Palpites</Text>

      <Text style={styles.section}>A disputar</Text>
      <FlatList
        data={partidas.filter(p => !p.disputado)}
        renderItem={renderPartida}
        keyExtractor={item => item.id}
      />

      <Text style={styles.section}>Disputado</Text>
      <FlatList
        data={partidas.filter(p => p.disputado)}
        renderItem={renderPartida}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { fontSize: 18, fontWeight: '600', marginTop: 15, marginBottom: 10 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  match: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  palpite: { fontSize: 16, marginBottom: 5 },
  result: { marginTop: 5 },
  placar: { fontSize: 14, color: '#555' },
  pontos: { fontSize: 14, fontWeight: 'bold', color: '#2e7d32' },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
