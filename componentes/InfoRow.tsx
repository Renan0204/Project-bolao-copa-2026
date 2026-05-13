import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type InfoRowProps = {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
  iconSize?: number;
};

export default function InfoRow({ iconName, text, iconSize = 14 }: InfoRowProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={iconSize} color="#8e8e93" />
      <Text style={styles.texto} numberOfLines={1}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  texto: {
    fontSize: 12,
    color: '#8e8e93',
    flex: 1,
  },
});
