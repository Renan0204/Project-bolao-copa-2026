import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function RecuperarContaScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperação</Text>

      <View style={styles.uploadBox}>
        <Text style={styles.uploadText}>📤 Upload</Text>
      </View>

      <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" />

      <TouchableOpacity style={styles.buttonPrimary}>
        <Text style={styles.buttonText}>Enviar código</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => router.push('/register')}>
        <Text style={styles.linkText}>Não tem uma conta? Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => router.push('/login')}>
        <Text style={styles.linkText}>Já possui conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  uploadBox: {
    backgroundColor: '#f2f2f2', 
    padding: 20, 
    borderRadius: 8,
    alignItems: 'center', 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#ddd',
  },
  uploadText: { 
    fontSize: 16, 
    color: '#555' 
  },
  input: {
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8,
    padding: 12, 
    marginBottom: 15, 
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 8,
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 10,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  link: { 
    marginTop: 15, 
    alignItems: 'center' 
  },
  linkText: { 
    color: '#007AFF', 
    fontSize: 14, 
    fontWeight: '500' 
  },
});