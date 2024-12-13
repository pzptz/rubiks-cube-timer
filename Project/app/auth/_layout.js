import { Stack } from "expo-router";
import { StyleSheet, Button } from "react-native";
import useSession from "@/utils/useSession";
import { useRouter } from "expo-router";
import Theme from "@/assets/theme";

export default function StackLayout() {
  const defaultTheme = "Dark";
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="signup"
        options={{
          headerLeft: () => (
            <Button
              color={Theme[defaultTheme].flair}
              title="Cancel"
              onPress={() => router.back()}
            />
          ),
          headerStyle: {
            backgroundColor: Theme[defaultTheme].backgroundPrimary,
          },
          headerTitleStyle: {
            color: Theme[defaultTheme].textPrimary,
          },
          headerTitle: "Create Account",
          presentation: "modal",
        }}
      />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
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
    fontSize: Theme.text.textXL,
    fontWeight: "bold",
    padding: 5,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  backText: {
    fontSize: Theme.text.textMedium,
    marginLeft: 8,
    paddingTop: 2,
  },
});
