import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { logar } from "../services/loginService";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function clicouEmlogar() {
    if (!email) {
      Alert.alert("Atenção!", "Email é obrigatório.");
      return;
    }

    if (!senha) {
      Alert.alert("Atenção!", "Senha é obrigatória.");
      return;
    }

    try {
      const token = await logar(email, senha);

      if (!token) {
        Alert.alert("Atenção!", "Falha ao realizar login, tente novamente.");
        return;
      }

      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar logar.");
      console.error(error);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.titleLogo}>Mãozinha BET</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Seu e-mail"
            placeholderTextColor="#8e8e93"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="••••••••••"
            placeholderTextColor="#8e8e93"
            secureTextEntry
            onChangeText={setSenha}
          />

          <TouchableOpacity style={styles.button} onPress={clicouEmlogar}>
            <Text style={styles.buttonText}>ENTRAR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkMargin}>
            <Text style={styles.linkText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>
                Não tem uma conta? Cadastre-se
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    padding: 10,
  },
  innerContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    height: "80%",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#B0B0B0",
    elevation: 5,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  titleLogo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 5,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#8e8e93",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#1c1c1e",
    backgroundColor: "#F2F2F2",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  linkMargin: {
    marginBottom: 15,
    alignSelf: "center",
  },
  linkText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
});
