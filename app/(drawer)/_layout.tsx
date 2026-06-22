import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, View, Text, StyleSheet } from 'react-native';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerTitle: () => (
          <View style={styles.headerContainer}>
            <Image 
              source={require("../../assets/logo.png")} 
              style={styles.headerLogo} 
              resizeMode="contain" 
            />
            <Text style={styles.headerText}>Bolão Copa 2026</Text>
          </View>
        ),
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#F8FAF7',
        },
        headerTintColor: '#111827',
        drawerActiveTintColor: '#15803D',
        drawerStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: 'Início',
          title: 'Início',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="partidas"
        options={{
          drawerLabel: 'Partidas',
          title: 'Partidas',
          drawerIcon: ({ color, size }) => <Ionicons name="football-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="palpites"
        options={{
          drawerLabel: 'Meus Palpites',
          title: 'Meus Palpites',
          drawerIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="ranking"
        options={{
          drawerLabel: 'Ranking',
          title: 'Ranking',
          drawerIcon: ({ color, size }) => <Ionicons name="trophy-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="usuario"
        options={{
          drawerLabel: 'Minha Conta',
          title: 'Minha Conta',
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="fazerPalpite"
        options={{
          title: 'Fazer Palpite',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="editarPalpite"
        options={{
          title: 'Editar Palpite',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="editarUsuario"
        options={{
          title: 'Editar Perfil',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="detalhesPartida"
        options={{
          title: 'Detalhes da Partida',
          drawerItemStyle: { display: 'none' }
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 65,
    height: 65,
    marginRight: 12,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#087a38',
  },
});