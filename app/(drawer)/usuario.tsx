import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function UsuarioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuário</Text>

      <View style={styles.profileCard}>
        <Text style={styles.field}>João da Bet </Text>
        <Text style={styles.field}>joaogameplay@gmail.com </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Quantidade de Palpites</Text>
        <Text style={styles.value}>12</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Minha pontuação</Text>
        <Text style={styles.value}>50</Text>
      </View>

      <TouchableOpacity style={styles.buttonExit}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDelete}>
        <Text style={styles.buttonText}>Excluir conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  profileCard: { marginBottom: 20 },
  field: { fontSize: 16, marginBottom: 10 },
  infoBox: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: { fontSize: 16, fontWeight: '600' },
  value: { fontSize: 16, fontWeight: 'bold' },
  buttonExit: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDelete: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
