import { Stack } from "expo-router";
import Theme from "@/assets/theme";
import { StyleSheet, SafeAreaView, Text, View } from "react-native";
export default function StackLayout() {
  const FeedHeader = ({ navigation, route, options }) => {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>Timer</Text>
        </View>
      </SafeAreaView>
    );
  };
  return (
    <Stack>
      <Stack.Screen
        name="main"
        options={{
          header: FeedHeader,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.backgroundPrimary,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "30%",
  },
  details: {
    backgroundColor: Theme.colors.backgroundPrimary,
    alignItems: "center",
    padding: 12,
  },
  text: {
    fontSize: 24,
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
  },
});
