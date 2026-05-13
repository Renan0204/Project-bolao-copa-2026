import React from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartItem from '../../componentes/CartItem';
import EmptyState from '../../componentes/EmptyState';
import { useCart } from '../../hooks/useCart';

const primaryColor = '#007AFF';

export default function CartScreen() {
  const { itens, carregando, removerItem, limparCarrinho, totalItens, totalFormatado } = useCart();

  const confirmarFinalizacao = () => {
    Alert.alert(
      'Finalizar Compra',
      `Confirmar compra de ${totalItens} ${totalItens === 1 ? 'ingresso' : 'ingressos'} por ${totalFormatado}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            await limparCarrinho();
            Alert.alert('Compra realizada!', 'Seus ingressos foram confirmados.');
          },
        },
      ]
    );
  };

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Meu Carrinho</Text>
        <Text style={styles.headerSubtitulo}>{totalItens} {totalItens === 1 ? 'item' : 'itens'}</Text>
      </View>

      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem item={item} onRemove={() => removerItem(item.id)} />
        )}
        contentContainerStyle={styles.listaContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState iconName="cart-outline" message="Seu carrinho está vazio" />
        }
      />

      {/* Rodapé com resumo e botão */}
      {totalItens > 0 && (
        <View style={styles.footer}>
          <View style={styles.resumo}>
            <Text style={styles.resumoLabel}>Total</Text>
            <Text style={styles.resumoValor}>{totalFormatado}</Text>
          </View>
          <TouchableOpacity
            style={[styles.botaoFinalizar, { backgroundColor: primaryColor }]}
            onPress={confirmarFinalizacao}
          >
            <Text style={styles.textoBotao}>Finalizar Compra</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  headerTitulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  headerSubtitulo: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '500',
  },
  listaContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e5ea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  resumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resumoLabel: {
    fontSize: 16,
    color: '#8e8e93',
    fontWeight: '600',
  },
  resumoValor: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1c1c1e',
  },
  botaoFinalizar: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
