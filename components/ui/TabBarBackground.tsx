import { StyleSheet, View } from 'react-native';

const TabBarBackground = () => {
  return <View style={styles.background} />;
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white', // or any color you prefer
    flex: 1,
  },
});

export default TabBarBackground;