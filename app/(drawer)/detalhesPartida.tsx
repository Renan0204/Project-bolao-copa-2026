import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DetalhesPartidaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Partida</Text>

      <View style={styles.header}>
        <Text style={styles.headerText}>Detalhe Partida</Text>
      </View>

      <View style={styles.matchCard}>
        <Text style={styles.matchTitle}>Brasil x Haiti</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Data:</Text>
        <Text style={styles.value}>20/06/2026</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Horário:</Text>
        <Text style={styles.value}>18:00</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Estádio:</Text>
        <Text style={styles.value}>Maracanã</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Fase:</Text>
        <Text style={styles.value}>Grupos</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>Agendado</Text>
      </View>

      <TouchableOpacity style={styles.buttonPrimary}>
        <Text style={styles.buttonText}>Fazer Palpite</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  header: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: { fontSize: 18, fontWeight: '600' },
  matchCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  matchTitle: { fontSize: 20, fontWeight: 'bold' },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: { fontSize: 16, fontWeight: '600' },
  value: { fontSize: 16 },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
