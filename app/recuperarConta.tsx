import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { AlertHelper } from "../utils/AlertHelper";

export default function RecuperarContaScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  async function enviarCodigo() {
    if (!email) {
      AlertHelper.warning("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const enviado = true;

      if (!enviado) {
        AlertHelper.error("E-mail inválido, tente novamente.");
        return;
      }

      AlertHelper.success("Código de verificação enviado!");
    } catch (error) {
      AlertHelper.error("Erro ao enviar código de verificação.");
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Recuperação</Text>

        <View style={styles.uploadBox}>
          <Text style={styles.uploadText}>📤 Upload</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#6B7280"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.buttonPrimary} onPress={enviarCodigo}>
          <Text style={styles.buttonText}>Enviar código</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.linkText}>Não tem uma conta? Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.linkText}>Já possui conta? Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#F8FAF7",
  },
  innerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  uploadBox: {
    backgroundColor: "#F3F4F6",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  uploadText: {
    fontSize: 16,
    color: "#6B7280",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#111827",
  },
  buttonPrimary: {
    backgroundColor: "#15803D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#15803D",
    fontSize: 14,
    fontWeight: "600",
  },
});