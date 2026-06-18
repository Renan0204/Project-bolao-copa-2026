import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
    const [jogos, setJogos] = useState([
        { id: "1", mandante: "Brasil", visitante: "Espanha", data: "25/06 - 19:00" },
        { id: "2", mandante: "Argentina", visitante: "França", data: "26/06 - 21:00" },
        { id: "3", mandante: "Japão", visitante: "Alemanha", data: "27/06 - 16:00" },
    ]);

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Text style={styles.dataText}>{item.data}</Text>
            <Text style={styles.matchText}>{item.mandante} vs {item.visitante}</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>PALPITAR</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Próximas Partidas</Text>
            <FlatList
                data={jogos}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#1c1c1e",
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
    },
    dataText: {
        fontSize: 12,
        color: "#8e8e93",
        marginBottom: 5,
    },
    matchText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    button: {
        width: "100%",
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#007AFF",
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: "#FFF"
    },
});