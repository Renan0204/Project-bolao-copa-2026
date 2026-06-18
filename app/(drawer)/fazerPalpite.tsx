import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function FazerPalpiteScreen() {
  const [golsBrasil, setGolsBrasil] = useState('');
  const [golsHaiti, setGolsHaiti] = useState('');

  const fazerPalpite = () => {
    console.log(`Palpite: Brasil ${golsBrasil} x Haiti ${golsHaiti}`);
    // Aqui futuramente você pode salvar no contexto ou enviar para API
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fazer Palpite</Text>

      <Text style={styles.section}>Palpite</Text>

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

      <Button title="Fazer palpite" onPress={fazerPalpite} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  block: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    textAlign: 'center',
  },
});
