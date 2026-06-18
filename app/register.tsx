import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { registrar } from "../services/registerService";

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmSenha, setConfirmSenha] = useState("");

    async function clicouEmCadastrar() {
        if (!name || !email || !senha || !confirmSenha) {
            Alert.alert("Atenção!", "Todos os campos são obrigatórios.");
            return;
        }

        if (senha !== confirmSenha) {
            Alert.alert("Atenção!", "As senhas não coincidem.");
            return;
        }

        try {
            await registrar(name, email, senha);
            Alert.alert("Sucesso", "Conta criada com sucesso!");
            router.replace("/login");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível realizar o cadastro.");
            console.error(error);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Cadastro</Text>

                <TextInput style={styles.input} placeholder="Nome" onChangeText={setName} />
                <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" onChangeText={setEmail} />
                <TextInput style={styles.input} placeholder="Senha" secureTextEntry onChangeText={setSenha} />
                <TextInput style={styles.input} placeholder="Confirmar Senha" secureTextEntry onChangeText={setConfirmSenha} />

                <TouchableOpacity style={styles.button} onPress={clicouEmCadastrar}>
                    <Text style={styles.buttonText}>CADASTRAR</Text>
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
        // Mantive a altura ajustável, mas se preferir travada use height: "80%"
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
        alignSelf: 'center',
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