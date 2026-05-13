import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Event } from '../types/event';

const CART_STORAGE_KEY = '@easy_ticket:cart';

// 1. Tipagem de tudo que o contexto vai expor para os consumidores
type CartContextData = {
  itens: Event[];
  carregando: boolean;
  adicionarItem: (evento: Event) => Promise<void>;
  removerItem: (id: string) => Promise<void>;
  limparCarrinho: () => Promise<void>;
  estaNoCarrinho: (id: string) => boolean;
  totalItens: number;
  totalFormatado: string;
  recarregar: () => Promise<void>;
};

// 2. Criação do contexto com valor inicial null
//    null indica que o hook foi chamado fora do Provider
const CartContext = createContext<CartContextData | null>(null);

// 3. Provider: componente que envolve a árvore e fornece os dados
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<Event[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Carrega o carrinho do AsyncStorage ao montar o Provider
  const carregarCarrinho = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (json) {
        setItens(JSON.parse(json));
      }
    } catch (erro) {
      console.error('Erro ao carregar carrinho:', erro);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarCarrinho();
  }, [carregarCarrinho]);

  // Persiste a lista atualizada no AsyncStorage e atualiza o estado
  const persistir = async (novosItens: Event[]) => {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(novosItens));
    setItens(novosItens);
  };

  const adicionarItem = async (evento: Event) => {
    const jaExiste = itens.some((item) => item.id === evento.id);
    if (jaExiste) return;
    await persistir([...itens, evento]);
  };

  const removerItem = async (id: string) => {
    await persistir(itens.filter((item) => item.id !== id));
  };

  const limparCarrinho = async () => {
    await AsyncStorage.removeItem(CART_STORAGE_KEY);
    setItens([]);
  };

  const estaNoCarrinho = (id: string) => itens.some((item) => item.id === id);

  const total = itens.reduce((soma, item) => {
    const numero = parseFloat(
      item.preco.replace(/[^\d,]/g, '').replace(',', '.')
    );
    return soma + (isNaN(numero) ? 0 : numero);
  }, 0);

  const totalFormatado = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    // 4. CartContext.Provider recebe o objeto "value" com todos os dados e funções
    <CartContext.Provider
      value={{
        itens,
        carregando,
        adicionarItem,
        removerItem,
        limparCarrinho,
        estaNoCarrinho,
        totalItens: itens.length,
        totalFormatado,
        recarregar: carregarCarrinho,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 5. Hook personalizado que lê o contexto
//    Lança um erro claro se usado fora do CartProvider
export function useCart(): CartContextData {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart deve ser usado dentro de um <CartProvider>');
  }

  return context;
}
