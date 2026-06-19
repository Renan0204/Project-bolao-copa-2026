import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
        { text: "Cancelar", style: "cancel" },
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

  const handleAlterarFoto = () => {
    Alert.alert("Funcionalidade", "Aqui abriríamos o seletor de imagens do telemóvel.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Conta</Text>

      <View style={styles.profileHeader}>
        <View style={styles.photoContainer}>
          <Ionicons name="person" size={60} color="#8e8e93" />
        </View>
        
        <TouchableOpacity onPress={handleAlterarFoto}>
          <Text style={styles.editPhotoText}>Alterar Foto Perfil</Text>
        </TouchableOpacity>

        <Text style={styles.userName}>João da Bet</Text>
        <Text style={styles.userEmail}>joaogameplay@gmail.com</Text>

        <TouchableOpacity 
          style={styles.buttonEditProfile}
          onPress={() => router.push('/(drawer)/editarUsuario')}
        >
          <Text style={styles.buttonTextEdit}>Editar Perfil (Nome e Email)</Text>
        </TouchableOpacity>
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  editPhotoText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  buttonEditProfile: {
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonTextEdit: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },

  infoBox: {
    backgroundColor: '#fff',
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
    backgroundColor: '#FF3B30',
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