// components/FloatingActionButton.tsx
import { dark } from '@/lib/color';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  onPress: () => void;
  icon?: string;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
  disabled?: boolean;
};

const FloatingActionButton = ({ 
  onPress, 
  icon = '+', 
  size = 56, 
  backgroundColor = dark.text,
  iconColor = dark.bg,
  disabled = false 
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: disabled ? '#666' : backgroundColor,
        }
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.fabIcon, { color: iconColor, fontSize: size * 0.4 }]}>
        {icon}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabIcon: {
    fontWeight: '600',
  },
});

export default FloatingActionButton;