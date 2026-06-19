import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function EditarUsuarioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuário</Text>

      <View style={styles.uploadBox}>
        <Text style={styles.uploadText}>📤 Upload Foto</Text>
      </View>

      <TextInput style={styles.input} placeholder="Nome" defaultValue="João da Bet" />
      <TextInput style={styles.input} placeholder="E-mail" defaultValue="joaogameplay@gmail.com" />

      <TouchableOpacity style={styles.buttonSave}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonCancel}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  uploadBox: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  uploadText: { fontSize: 16, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonSave: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#FF9500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
