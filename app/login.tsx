import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { logar } from "../services/loginService";
import { AlertHelper } from "../utils/AlertHelper";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function clicouEmLogar() {
    const emailTratado = email.trim().toLowerCase();

    if (!emailTratado) {
      AlertHelper.warning("E-mail é obrigatório.");
      return;
    }

    if (!senha) {
      AlertHelper.warning("Senha é obrigatória.");
      return;
    }

    try {
      setCarregando(true);

      const token = await logar(emailTratado, senha);

      if (!token) {
        AlertHelper.error("Falha ao realizar login, tente novamente.");
        return;
      }

      AlertHelper.success("Login realizado com sucesso!");
      router.replace("/(drawer)/home");
    } catch (error) {
      AlertHelper.error("Ocorreu um erro ao tentar logar.");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }

  function voltarParaVisitante() {
    router.replace("/");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={voltarParaVisitante}>
        <Ionicons name="arrow-back" size={28} color="#15803D" />
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.innerContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#6B7280"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            returnKeyType="done"
            onSubmitEditing={clicouEmLogar}
          />

          <TouchableOpacity
            style={[styles.buttonPrimary, carregando && styles.buttonDisabled]}
            onPress={clicouEmLogar}
            disabled={carregando}
          >
            <Text style={styles.buttonText}>
              {carregando ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => router.push("/cadastro")}
          >
            <Text style={styles.linkText}>Não tem uma conta? Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => router.push("/recuperarConta")}
          >
            <Text style={styles.linkText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF7",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 15,
    paddingTop: 80,
    paddingBottom: 120,
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    zIndex: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  innerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    width: 160,
    height: 160,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
  },
  buttonPrimary: {
    backgroundColor: "#15803D",
    width: "100%",
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 12,
    alignItems: "center",
  },
  linkText: {
    color: "#15803D",
    fontSize: 14,
    fontWeight: "600",
  },
});