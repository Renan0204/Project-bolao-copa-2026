import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

{/* 
    <TouchableOpacity style={styles.botaoComprar}>
        <FontAwesome name="shopping-cart" size={24} color="white" />
        <Text style={styles.textoBotao}>Comprar</Text>
    </TouchableOpacity> 
*/}

type ButtonProps = {
    texto: string;
    icon: boolean;
    role: "info" | "danger"
    quandoClicar: () => void
}

export function Button(props: ButtonProps) {
    const { 
        icon,
        quandoClicar,
        role,
        texto
    } = props;

    let corDeFundo = "#0066FF";

    if (role === "danger") {
        corDeFundo = "red"
    }

    return (
        <TouchableOpacity 
            onPress={quandoClicar}
            style={[
                styles.botaoComprar,
                {
                    backgroundColor: corDeFundo
                }
            ]}
        >
            {
                icon === true 
                    ? (
                        <FontAwesome 
                            name="shopping-cart" 
                            size={24} 
                            color="white" 
                        />
                    ) : (
                        <></>
                    )
            }
            <Text style={styles.textoBotao}>{texto}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    botaoComprar: {
        backgroundColor: '#0066FF',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 6,
        flexDirection: "row-reverse",
        alignContent: "center",
        gap: 12
    },
    textoBotao: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});