import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

type Partida = {
  id: string;
  timeA: string;
  timeB: string;
};

const partidas: Partida[] = [
  { id: '1', timeA: 'Brasil', timeB: 'Haiti' },
  { id: '2', timeA: 'Venezuela', timeB: 'França' },
  { id: '3', timeA: 'México', timeB: 'África' },
  { id: '4', timeA: 'Japão', timeB: 'EUA' },
];

export default function PartidasScreen() {
  const renderItem = ({ item }: { item: Partida }) => (
    <View style={styles.card}>
      <Text style={styles.match}>{item.timeA} x {item.timeB}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Partidas</Text>
      <Text style={styles.filters}>Fase | Data | Status</Text>

      <Text style={styles.section}>Listagem grupo A</Text>
      <FlatList
        data={partidas}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  match: { fontSize: 16, fontWeight: '600' },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
