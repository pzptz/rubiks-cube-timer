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
  const themeChoice = useContext(settings).themeChoice;
  const router = useRouter();
  const session = useSession();
  const setAverages = useContext(averagesContext).setAverages;
  return (
    <Stack>
      {/* Main Statistics Screen */}
      <Stack.Screen
        name="statistics"
        options={{
          headerShown: false,
        }}
      />

      {/* Detail Screen */}
      <Stack.Screen
        name="details"
        options={{
          headerTitleAlign: "center",
          headerTitle: "Solve Details",
          headerTintColor: Theme[themeChoice].flair,
          headerStyle: {
            backgroundColor: Theme[themeChoice].backgroundPrimary,
          },
          headerTitleStyle: {
            color: Theme[themeChoice].textPrimary,
            fontWeight: "bold",
          },
          headerBackTitle: "Back",
          headerBackTitleStyle: [
            styles.backButton,
            { color: Theme[themeChoice].flair },
          ],
          headerTintColor: Theme[themeChoice].flair,
        }}
      />

      {/* Insert Time Screen */}
      <Stack.Screen
        name="newtime"
        options={{
          headerTitleAlign: "center",
          presentation: "modal",
          headerTitle: "Add New Time",
          headerTintColor: Theme[themeChoice].flair,
          headerStyle: {
            backgroundColor: Theme[themeChoice].backgroundPrimary,
          },
          headerTitleStyle: {
            color: Theme[themeChoice].textPrimary,
            fontWeight: "bold",
          },
          headerLeft: () => (
            <Button
              title="Cancel"
              onPress={() => router.back()}
              color={Theme[themeChoice].flair}
            />
          ),
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
