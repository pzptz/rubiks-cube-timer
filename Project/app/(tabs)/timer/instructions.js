import { View, Text, StyleSheet } from "react-native";
export default function Instructions() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Use the scramble at the top of the screen. Touch anywhere on the screen
        to start the timer and then to stop it. The stats page stores all of
        your previous times and averages.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  text: {
    fontSize: 24,
    padding: 12,
    textAlign: "center",
    alignContent: "center",
  },
});
