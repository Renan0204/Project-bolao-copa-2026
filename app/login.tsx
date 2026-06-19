import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { logar } from '../services/loginService';
import { AlertHelper } from './utils/AlertHelper';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function clicouEmLogar() {
    if (!email) {
      AlertHelper.warning("E-mail é obrigatório.");
      return;
    }

    if (!senha) {
      AlertHelper.warning("Senha é obrigatória.");
      return;
    }

    try {
      const token = await logar(email, senha);

      if (!token) {
        AlertHelper.error("Falha ao realizar login, tente novamente.");
        return;
      }

      // sucesso no login
      AlertHelper.success("Login realizado com sucesso!");
      router.replace("/(drawer)/home");
    } catch (error) {
      AlertHelper.error("Ocorreu um erro ao tentar logar.");
      console.error(error);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.uploadBox}>
          <Text style={styles.uploadText}> Logo / Upload</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.buttonPrimary} onPress={clicouEmLogar}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => router.push('/register')}>
          <Text style={styles.linkText}>Não tem uma conta? Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => router.push('/recuperarConta')}>
          <Text style={styles.linkText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    padding: 15,
  },
  innerContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#B0B0B0",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  uploadBox: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  uploadText: {
    fontSize: 16,
    color: "#555",
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#8e8e93",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#1c1c1e",
    backgroundColor: "#F2F2F2",
    marginBottom: 15,
  },
  buttonPrimary: {
    backgroundColor: "#007AFF",
    width: "100%",
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 12,
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 14,
  },
});
