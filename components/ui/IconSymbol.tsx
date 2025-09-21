import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

// Define a type for the icon mapping
type IconNameMap = {
  [key: string]: keyof typeof MaterialCommunityIcons.glyphMap;
};

// Map SF Symbols to Material Community Icons
const iconMap: IconNameMap = {
  // Tab Bar Icons
  'house.fill': 'home',
  'chart.bar': 'chart-bar',
  'gear': 'cog',
  
  // Common Icons
  'person': 'account',
  'person.circle': 'account-circle',
  'chevron.up': 'chevron-up',
  'chevron.down': 'chevron-down',
  'chevron.right': 'chevron-right',
  'checkmark.circle': 'check-circle',
  'arrow.right.square': 'arrow-right-box',
  'figure.walk': 'walk',
  'heart.circle': 'heart-circle',
  'calendar': 'calendar',
  'heart.text.square': 'heart-box',
  'flame': 'fire',
  'clock': 'clock',
  'power': 'power',
  // Add more icons as needed
} as const;

interface IconSymbolProps {
  name: keyof typeof iconMap;
  size: number;
  color: string;
  style?: StyleProp<TextStyle>;
}

export const IconSymbol: React.FC<IconSymbolProps> = ({
  name,
  size,
  color,
  style,
}) => {
  const iconName = iconMap[name] || 'help-circle';
  
  return (
    <MaterialCommunityIcons
      name={iconName}
      size={size}
      color={color}
      style={style}
    />
  );
};

export default IconSymbol;