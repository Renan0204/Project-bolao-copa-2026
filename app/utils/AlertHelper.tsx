import { Alert } from 'react-native';

export const AlertHelper = {
  success(message: string) {
    Alert.alert("Sucesso", message);
  },
  error(message: string) {
    Alert.alert("Erro", message);
  },
  warning(message: string) {
    Alert.alert("Aviso", message);
  }
};
