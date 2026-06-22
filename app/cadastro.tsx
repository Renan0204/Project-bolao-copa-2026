import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { registrar } from "../services/cadastroService";
import { AlertHelper } from "../utils/AlertHelper";

export default function CadastroScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function clicouEmCadastrar() {
    const nomeTratado = name.trim();
    const emailTratado = email.trim().toLowerCase();

    if (!nomeTratado || !emailTratado || !senha || !confirmSenha) {
      AlertHelper.warning("Todos os campos são obrigatórios.");
      return;
    }

    if (nomeTratado.length < 3) {
      AlertHelper.warning("O nome deve ter pelo menos 3 letras.");
      return;
    }

    const emailValido = /\S+@\S+\.\S+/;
    if (!emailValido.test(emailTratado)) {
      AlertHelper.warning("Por favor, insira um e-mail válido.");
      return;
    }

    if (senha.length < 6) {
      AlertHelper.warning("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmSenha) {
      AlertHelper.warning("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);

      await registrar(nomeTratado, emailTratado, senha);

      AlertHelper.success("Conta criada com sucesso!");
      router.replace("/login");
    } catch (error: any) {
      const mensagem =
        error?.response?.data?.erro ||
        error?.response?.data?.mensagem ||
        error?.response?.data ||
        "Não foi possível realizar o cadastro.";

      AlertHelper.error(String(mensagem));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      style={styles.container}
    >
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

          <Text style={styles.title}>Cadastro</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#6B7280"
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />

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
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar Senha"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={confirmSenha}
            onChangeText={setConfirmSenha}
            returnKeyType="done"
            onSubmitEditing={clicouEmCadastrar}
          />

          <TouchableOpacity
            style={[styles.button, carregando && styles.buttonDisabled]}
            onPress={clicouEmCadastrar}
            disabled={carregando}
          >
            <Text style={styles.buttonText}>
              {carregando ? "CADASTRANDO..." : "CADASTRAR"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Já tem uma conta? Voltar</Text>
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
    padding: 20,
    paddingBottom: 120,
  },
  innerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#15803D",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  linkText: {
    color: "#15803D",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
});