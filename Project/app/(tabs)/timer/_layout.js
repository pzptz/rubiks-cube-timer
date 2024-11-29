import { Stack } from "expo-router";
import Theme from "@/assets/theme";
import { StyleSheet, SafeAreaView, Text, View } from "react-native";
export default function StackLayout() {
  const MainHeader = ({ navigation, route, options }) => {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>Timer</Text>
        </View>
      </SafeAreaView>
    );
  };
  const InstructionsHeader = ({ navigation, route, options }) => {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>Instructions</Text>
        </View>
      </SafeAreaView>
    );
  };
  return (
    <Stack>
      <Stack.Screen
        name="main"
        options={{
          header: MainHeader,
        }}
      />

      <Stack.Screen
        name="instructions"
        options={{
          headerStyle: styles.instructions,
          headerTitleStyle: styles.text,
          headerTitle: "Instructions",
          headerBackTitle: "Back",
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
  text: {
    fontSize: 24,
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
  },
  instructions: {
    backgroundColor: Theme.colors.backgroundPrimary,
  },
});
