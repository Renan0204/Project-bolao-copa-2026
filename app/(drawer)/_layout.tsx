import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Importando suas telas (estão na mesma pasta app/(drawer))
import HomeScreen from './home';
import PerfilScreen from './profile';
import PalpitesScreen from './palpites';
import FazerPalpiteScreen from './fazerPalpite';
import EditarPalpiteScreen from './editarPalpite';

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Perfil" component={PerfilScreen} />
      <Drawer.Screen name="Palpites" component={PalpitesScreen} />
      <Drawer.Screen name="Fazer Palpite" component={FazerPalpiteScreen} />
      <Drawer.Screen name="Editar Palpite" component={EditarPalpiteScreen} />
    </Drawer.Navigator>
  );
}
