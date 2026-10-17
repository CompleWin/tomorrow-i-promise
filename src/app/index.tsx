import { Text, View, StyleSheet } from "react-native";
import app from '../../app.json'

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>{app.expo.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
