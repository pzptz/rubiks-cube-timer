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
          headerTitle: "Solve Details",
          headerTintColor: Theme.dark.textHighlighted,
          headerStyle: {
            backgroundColor: Theme.dark.backgroundPrimary,
          },
          headerTitleStyle: {
            color: Theme.dark.textPrimary,
            fontWeight: "bold",
          },
          headerBackTitle: "Back",
          headerBackTitleStyle: styles.backButton,
          headerTintColor: Theme.dark.textHighlighted,
        }}
      />

      {/* Insert Time Screen */}
      {/*TODO: add headerRight and replace Add Solve Time button in newtime*/}
      <Stack.Screen
        name="newtime"
        options={{
          presentation: "modal",
          headerTitle: "Add New Time",
          headerTintColor: Theme.dark.textHighlighted,
          headerStyle: {
            backgroundColor: Theme.dark.backgroundPrimary,
          },
          headerTitleStyle: {
            color: Theme.dark.textPrimary,
            fontWeight: "bold",
          },
          headerLeft: () => (
            <Button
              title="Cancel"
              onPress={() => router.back()}
              color={Theme.dark.textPrimary}
            />
          ),
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
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    color: Theme.dark.textHighlighted,
  },
  backText: {
    color: Theme.dark.textPrimary,
    fontSize: 16,
    marginLeft: 8,
    paddingTop: 2,
  },
});
