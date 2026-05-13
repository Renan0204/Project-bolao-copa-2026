import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Event } from '../types/event';

type EventCardProps = {
  item: Event;
  onPress: () => void;
};

export default function EventCard({ item, onPress }: EventCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.imagem }} style={styles.imagemCapa} />
      <View style={styles.infoContainer}>
        <Text style={styles.dataTexto}>{item.data}</Text>
        <Text style={styles.tituloTexto} numberOfLines={2}>{item.titulo}</Text>
        <Text style={styles.localTexto}>{item.local}</Text>
        <View style={styles.rodapeCard}>
          <Text style={styles.precoTexto}>{item.preco}</Text>
          <TouchableOpacity style={styles.botaoComprar} onPress={onPress}>
            <Text style={styles.textoBotao}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagemCapa: {
    width: '100%',
    height: 160,
  },
  infoContainer: {
    padding: 15,
  },
  dataTexto: {
    color: '#FF5A5F',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  tituloTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  localTexto: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  rodapeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  precoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  botaoComprar: {
    backgroundColor: '#0066FF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
