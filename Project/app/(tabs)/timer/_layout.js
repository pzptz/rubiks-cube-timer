import { Stack } from "expo-router";
import Theme from "@/assets/theme";
import { settings } from "@/assets/contexts";
import { useContext } from "react";
import { StyleSheet, SafeAreaView, Text, View } from "react-native";
export default function StackLayout() {
  const themeChoice = useContext(settings).themeChoice;
  const MainHeader = ({ navigation, route, options }) => {
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
          header: MainHeader,
        }}
      />

      <Stack.Screen
        name="instructions"
        options={{
          headerStyle: styles.instructions,
          headerTitleStyle: styles.text,
          headerTitle: "How to use",
          headerBackTitle: "Back",
          headerBackTitleStyle: styles.backButton,
          headerTintColor: Theme.dark.textHighlighted,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.dark.backgroundPrimary,
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
    color: Theme.dark.textPrimary,
    fontWeight: "bold",
    padding: 5,
  },
  instructions: {
    backgroundColor: Theme.dark.backgroundPrimary,
  },
  backButton: {
    color: Theme.dark.textHighlighted,
  },
});
