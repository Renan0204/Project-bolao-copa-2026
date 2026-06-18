import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="person-circle-outline" size={50} color="#000" />
                <Text style={styles.greeting}>Saudação, Usuário</Text>
                <TouchableOpacity>
                    <Ionicons name="menu" size={30} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabsRow}>
                <TouchableOpacity style={styles.tabButton}><Text style={styles.tabText}>Próximas partidas</Text></TouchableOpacity>
                <TouchableOpacity style={styles.tabButton}><Text style={styles.tabText}>Ranking resumido</Text></TouchableOpacity>
                <TouchableOpacity style={styles.tabButton}><Text style={styles.tabText}>Pontuação atual</Text></TouchableOpacity>
            </View>

            <View style={styles.featuredCard}>
                <Text style={styles.matchText}>Brasil x Haiti</Text>
                <TouchableOpacity style={styles.palpitarButton}>
                    <Text style={styles.palpitarText}>palpitar</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Palpitar</Text>

            <View style={styles.gridRow}>
                <View style={styles.smallCard}>
                    <Text style={styles.smallMatchText}>México x Africa</Text>
                    <TouchableOpacity style={styles.palpitarButton}>
                        <Text style={styles.palpitarText}>palpitar</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.smallCard}>
                    <Text style={styles.smallMatchText}>Japão x Eua</Text>
                    <TouchableOpacity style={styles.palpitarButton}>
                        <Text style={styles.palpitarText}>palpitar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    greeting: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tabsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    tabButton: {
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '32%',
        alignItems: 'center',
    },
    tabText: {
        fontSize: 10,
        fontWeight: '600',
        textAlign: 'center',
    },
    featuredCard: {
        backgroundColor: '#FFF',
        paddingVertical: 60,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
        borderRadius: 5,
    },
    matchText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    palpitarButton: {
        borderWidth: 1,
        borderColor: '#000',
        paddingHorizontal: 30,
        paddingVertical: 5,
        borderRadius: 5,
    },
    palpitarText: {
        fontWeight: 'bold',
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    smallCard: {
        backgroundColor: '#FFF',
        width: '48%',
        paddingVertical: 40,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    smallMatchText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
    },
});