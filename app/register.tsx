// app/register.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { registrar } from "../services/registerService";

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function clicouEmCadastrar() {
        if (!name || !email || !senha) {
            Alert.alert("Atenção!", "Todos os campos são obrigatórios.");
            return;
        }

        try {
            await registrar(name, email, senha);
            Alert.alert("Sucesso", "Conta criada com sucesso!");
            router.replace("/login");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível realizar o cadastro. Tente novamente.");
            console.error(error);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Ionicons name="person-add-outline" size={64} color={"#007AFF"} style={styles.logo} />
                <Text style={styles.title}>Crie sua conta</Text>

                <Text style={styles.label}>Nome</Text>
                <TextInput style={styles.input} placeholder="Seu nome" onChangeText={setName} />

                <Text style={styles.label}>E-mail</Text>
                <TextInput style={styles.input} placeholder="email@example.com" keyboardType="email-address" onChangeText={setEmail} autoCapitalize="none" />

                <Text style={styles.label}>Senha</Text>
                <TextInput style={styles.input} placeholder="*********" secureTextEntry onChangeText={setSenha} />

                <TouchableOpacity style={styles.button} onPress={clicouEmCadastrar}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
                    <Text style={{ color: "#8e8e93" }}>Já tem uma conta? Voltar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF" },
    innerContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, paddingBottom: 40 },
    logo: { marginBottom: 10 },
    title: { fontSize: 24, fontWeight: "bold", color: "#1c1c1e", marginBottom: 30 },
    label: { alignSelf: "flex-start", fontSize: 14, fontWeight: '600', color: '#8e8e93', marginBottom: 5 },
    input: { width: "100%", height: 50, borderWidth: 1, borderColor: "#e5e5ea", borderRadius: 12, paddingHorizontal: 15, fontSize: 16, color: "#1c1c1e", backgroundColor: "#fbfbfd", marginBottom: 15 },
    button: { width: "100%", height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: "#007AFF" },
    buttonText: { fontSize: 16, fontWeight: 'bold', color: "#FFF" }
});