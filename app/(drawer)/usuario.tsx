import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function UsuarioScreen() {
  const router = useRouter();

  const handleSair = () => {
    router.replace('/login');
  };

  const handleExcluirConta = () => {
    Alert.alert(
      "Excluir Conta",
      "Tem a certeza que deseja excluir a sua conta? Esta ação é irreversível e perderá todos os seus palpites.",
      [
        { 
          text: "Cancelar", 
          style: "cancel" 
        },
        { 
          text: "Sim, excluir", 
          style: "destructive",
          onPress: () => {
            Alert.alert("Conta excluída", "A sua conta foi removida com sucesso.");
            router.replace('/login');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Conta</Text>

      <View style={styles.profileCard}>
        <Text style={styles.field}>João da Bet</Text>
        <Text style={styles.field}>joaogameplay@gmail.com</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Quantidade de Palpites</Text>
        <Text style={styles.value}>12</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Minha pontuação</Text>
        <Text style={styles.value}>50</Text>
      </View>

      <TouchableOpacity style={styles.buttonExit} onPress={handleSair}>
        <Text style={styles.buttonText}>Sair da Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDelete} onPress={handleExcluirConta}>
        <Text style={styles.buttonTextDelete}>Excluir conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  profileCard: { 
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20 
  },
  field: { fontSize: 16, marginBottom: 5, color: '#333' },
  infoBox: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: { fontSize: 16, fontWeight: '600', color: '#555' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  buttonExit: {
    backgroundColor: '#FF3B30', // Cor vermelha para indicar saída
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDelete: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonTextDelete: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold' }
});