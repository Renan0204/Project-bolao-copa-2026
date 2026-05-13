import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Event } from '../types/event';
import InfoRow from './InfoRow';

const primaryColor = '#007AFF';

type CartItemProps = {
  item: Event;
  onRemove?: () => void;
};

export default function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.imagem }} style={styles.imagemCard} />
      <View style={styles.infoCard}>
        <Text style={styles.tituloCard} numberOfLines={2}>{item.titulo}</Text>
        <InfoRow iconName="calendar-outline" text={item.data} />
        <InfoRow iconName="location-outline" text={item.local} />
        <Text style={styles.precoCard}>{item.preco}</Text>
      </View>
      <TouchableOpacity style={styles.botaoRemover} onPress={onRemove}>
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e5ea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  imagemCard: {
    width: 90,
    height: 110,
    resizeMode: 'cover',
  },
  infoCard: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  tituloCard: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 6,
  },
  precoCard: {
    fontSize: 15,
    fontWeight: 'bold',
    color: primaryColor,
    marginTop: 6,
  },
  botaoRemover: {
    padding: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
