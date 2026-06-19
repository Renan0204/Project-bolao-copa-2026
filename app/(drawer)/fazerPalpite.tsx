import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function FazerPalpiteScreen() {
  const router = useRouter();
  const [golsBrasil, setGolsBrasil] = useState('');
  const [golsHaiti, setGolsHaiti] = useState('');

  const handleFazerPalpite = () => {
    if (!golsBrasil || !golsHaiti) {
      Alert.alert("Atenção", "Por favor, preencha a quantidade de golos para ambas as equipas.");
      return;
    }

    console.log(`Palpite registado: Brasil ${golsBrasil} x Haiti ${golsHaiti}`);
    Alert.alert("Sucesso", "Palpite registado com sucesso!");
    
    router.replace('/(drawer)/palpites');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fazer Palpite</Text>
      <Text style={styles.section}>Insira o seu palpite para o jogo:</Text>

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

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleFazerPalpite}>
        <Text style={styles.buttonText}>Confirmar Palpite</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  section: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  block: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  label: { fontSize: 18, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: 100,
    textAlign: 'center',
    backgroundColor: '#fff',
    fontSize: 16
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});