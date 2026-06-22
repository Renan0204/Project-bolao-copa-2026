import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function EditarPalpiteScreen() {
  const [golsBrasil, setGolsBrasil] = useState('2');
  const [golsHaiti, setGolsHaiti] = useState('1');

  const salvarAlteracoes = () => {
    console.log(`Novo palpite: Brasil ${golsBrasil} x Haiti ${golsHaiti}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Palpite</Text>

      <View style={styles.block}>
        <Text style={styles.label}>Brasil</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={golsBrasil}
          onChangeText={setGolsBrasil}
          placeholder="Qtd Gol"
        />
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Haiti</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={golsHaiti}
          onChangeText={setGolsHaiti}
          placeholder="Qtd Gol"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAF7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
    textAlign: 'center',
  },
  block: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#15803D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});