import { Stack } from "expo-router";
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Pressable,
} from "react-native";
import db from "@/database/db";
import { averagesContext, settings } from "@/assets/contexts";
import useSession from "@/utils/useSession";
import { useRouter } from "expo-router";
import Theme from "@/assets/theme";

export default function StackLayout() {
  const defaultTheme = "Dark";
  const router = useRouter();
  const session = useSession();
  return (
    <Stack>
      {/* Main Statistics Screen */}
      <Stack.Screen
        name="signup"
        options={{
          presentation: "modal",
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
        }}
      />
      <Stack.Screen name="loginProxy" options={{ headerShown: false }} />
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
