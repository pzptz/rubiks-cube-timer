import { View, StyleSheet, ActivityIndicator } from "react-native";

import Theme from "@/assets/theme";

export default function Loading({ themeChoice = "dark" }) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Theme[themeChoice].backgroundPrimary },
      ]}
    >
      <ActivityIndicator size="large" />
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
