import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function EditarUsuarioScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('João da Bet');
  const [email, setEmail] = useState('joaogameplay@gmail.com');

  const handleSalvar = () => {
    if (!nome || !email) {
      Alert.alert("Atenção", "Todos os campos devem ser preenchidos.");
      return;
    }

    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    router.back(); // Volta para a tela de Usuário refletindo a intenção de fechar
  };

  const handleCancelar = () => {
    router.back(); // Apenas volta para o ecrã anterior sem alterar nada
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome de exibição</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite o seu nome"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite o seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={handleCancelar}>
          <Text style={styles.buttonTextSecondary}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  form: { flex: 1, justifyContent: 'flex-start' },
  label: { fontSize: 16, fontWeight: '600', color: '#555', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonSecondary: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#666',
  },
  buttonTextSecondary: { color: '#666', fontSize: 16, fontWeight: 'bold' }
});