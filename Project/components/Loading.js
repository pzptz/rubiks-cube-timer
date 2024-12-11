import { View, StyleSheet, ActivityIndicator } from "react-native";

import Theme from "@/assets/theme";

export default function Loading({ themeChoice }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.dark.backgroundPrimary,
  },
});
