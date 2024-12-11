import { Stack } from "expo-router";
import Theme from "@/assets/theme";
import { settings } from "@/assets/contexts";
import { useContext } from "react";
import { StyleSheet, SafeAreaView, Text, View } from "react-native";
export default function StackLayout() {
  const themeChoice = useContext(settings).themeChoice;
  const MainHeader = ({ navigation, route, options }) => {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Theme[themeChoice].backgroundPrimary },
        ]}
      >
        <View style={styles.header}>
          <Text
            style={[styles.text, { color: Theme[themeChoice].textPrimary }]}
          >
            Timer
          </Text>
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
          headerStyle: {
            backgroundColor: Theme[themeChoice].backgroundPrimary,
          },
          headerTitleStyle: [
            styles.text,
            { color: Theme[themeChoice].textPrimary },
          ],
          headerTitle: "How to use",
          headerBackTitle: "Back",
          headerBackTitleStyle: { color: Theme[themeChoice].textHighlighted },
          headerTintColor: Theme[themeChoice].textHighlighted,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
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
    fontWeight: "bold",
    padding: 5,
  },
});
