// app/(drawer)/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerTitle: "Bolão Copa 2026",
        headerTitleAlign: 'center',
        drawerActiveTintColor: '#007AFF',
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: 'Início',
          drawerLabel: 'Início',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: 'Perfil',
          drawerLabel: 'Perfil',
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}