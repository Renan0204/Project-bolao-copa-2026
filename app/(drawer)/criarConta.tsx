import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function CriarContaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <View style={styles.uploadBox}>
        <Text style={styles.uploadText}>📤 Upload</Text>
      </View>

      <TextInput style={styles.input} placeholder="Nome" />
      <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirmar Senha" secureTextEntry />

      <TouchableOpacity style={styles.buttonPrimary}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link}>
        <Text style={styles.linkText}>Já possui conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  uploadBox: {
    backgroundColor: '#f2f2f2', padding: 20, borderRadius: 8,
    alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#ddd',
  },
  uploadText: { fontSize: 16, color: '#555' },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 12, marginBottom: 15, fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: '#34C759', padding: 12, borderRadius: 8,
    alignItems: 'center', marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { alignItems: 'center', marginBottom: 10 },
  linkText: { color: '#007AFF', fontSize: 16 },
});
