import { View, Text, StyleSheet } from "react-native";
import Theme from "@/assets/theme";
import { settings } from "@/assets/contexts";
import { useContext } from "react";
export default function Instructions() {
  const themeChoice = useContext(settings).themeChoice;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Theme[themeChoice].backgroundPrimary },
      ]}
    >
      <Text style={[styles.text, { color: Theme[themeChoice].textPrimary }]}>
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
    fontSize: Theme.text.textXL,
    padding: 12,
    textAlign: "center",
    alignContent: "center",
  },
});
