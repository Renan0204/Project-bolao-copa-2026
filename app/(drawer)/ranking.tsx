import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

type Jogador = {
  id: string;
  nome: string;
  pontos: number;
};

const ranking: Jogador[] = [
  { id: '1', nome: 'João', pontos: 50 },
  { id: '2', nome: 'Marcos', pontos: 40 },
  { id: '3', nome: 'Maria', pontos: 35 },
  { id: '4', nome: 'Mendes', pontos: 25 },
  { id: '5', nome: 'Fred', pontos: 15 },
];

export default function RankingScreen() {
  const renderItem = ({ item }: { item: Jogador }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nome}</Text>
      <Text style={styles.points}>{item.pontos}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>

      <View style={styles.myRankingCard}>
        <Text style={styles.myRankingTitle}>Meu Ranking</Text>
        <Text style={styles.myRankingText}>1º João — 50</Text>
      </View>

      <FlatList
        data={ranking}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  myRankingCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  myRankingTitle: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  myRankingText: { fontSize: 16, fontWeight: '500' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: { fontSize: 16 },
  points: { fontSize: 16, fontWeight: 'bold' },
});
