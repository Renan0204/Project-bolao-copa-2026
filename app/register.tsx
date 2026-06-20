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
} from "react-native";
import { registrar } from "../services/registerService";
import { AlertHelper } from "./utils/AlertHelper";

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmSenha, setConfirmSenha] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function clicouEmCadastrar() {
        if (!name || !email || !senha || !confirmSenha) {
            AlertHelper.warning("Todos os campos são obrigatórios.");
            return;
        }

        if (senha !== confirmSenha) {
            AlertHelper.warning("As senhas não coincidem.");
            return;
        }

        try {
            setCarregando(true);

            await registrar(name, email, senha);

            AlertHelper.success("Conta criada com sucesso!");
            router.replace("/login");
        } catch (error: any) {
            console.error("Erro ao cadastrar usuário:", error);

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
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Cadastro</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                />

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

                <TextInput
                    style={styles.input}
                    placeholder="Confirmar Senha"
                    secureTextEntry
                    value={confirmSenha}
                    onChangeText={setConfirmSenha}
                />

                <TouchableOpacity
                    style={styles.button}
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
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#B0B0B0",
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 30,
        alignSelf: "center",
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
    linkText: {
        color: "#007AFF",
        fontWeight: "600",
        fontSize: 14,
        textAlign: "center",
    },
});