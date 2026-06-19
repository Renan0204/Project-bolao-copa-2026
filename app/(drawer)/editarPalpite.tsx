import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function EditarPalpiteScreen() {
  // Aqui você pode inicializar os valores com o palpite já existente
  const [golsBrasil, setGolsBrasil] = useState('2'); // exemplo: já tinha 2 gols
  const [golsHaiti, setGolsHaiti] = useState('1');  // exemplo: já tinha 1 gol

  const salvarAlteracoes = () => {
    console.log(`Novo palpite: Brasil ${golsBrasil} x Haiti ${golsHaiti}`);
    // Futuramente: atualizar contexto ou enviar para API
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

      <Button title="Salvar Alterações" onPress={salvarAlteracoes} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
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
