import { StyleSheet, Text, TextProps, useColorScheme } from 'react-native';
import { COLORS } from '../app/constants/Colors';

type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'subtitle';
};

export function ThemedText({
    style,
    lightColor,
    darkColor,
    type = 'default',
    ...rest
  }: ThemedTextProps) {
    const colorScheme = useColorScheme() || 'light';
    const color = colorScheme === 'light' ? darkColor || COLORS.black : lightColor || COLORS.primaryLight;
    
    const textStyle = [
      type === 'title' && { fontSize: 24, fontWeight: 'bold' },
      type === 'subtitle' && { fontSize: 18, fontWeight: '600' },
      { color },
      style,
    ];
  
    return <Text style={styles.textStyle} {...rest} />;
  }  // This closing brace was missing

  const styles = StyleSheet.create({
    textStyle: {
      color: 'black'
    }
    
  })