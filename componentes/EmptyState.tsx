import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type EmptyStateProps = {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  message: string;
};

export default function EmptyState({ iconName, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={64} color="#e5e5ea" />
      <Text style={styles.texto}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  texto: {
    fontSize: 16,
    color: '#8e8e93',
    marginTop: 12,
  },
});
