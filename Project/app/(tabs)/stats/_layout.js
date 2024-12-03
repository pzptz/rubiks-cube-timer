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
import { averagesContext } from "@/assets/contexts";
import useSession from "@/utils/useSession";
import { useRouter } from "expo-router";
import Theme from "@/assets/theme";

export default function StackLayout() {
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
          headerTintColor: Theme.colors.textHighlighted,
          headerStyle: {
            backgroundColor: Theme.colors.backgroundPrimary,
          },
          headerTitleStyle: {
            color: Theme.colors.textPrimary,
            fontWeight: "bold",
          },
          headerBackTitle: "Back",
          headerBackTitleStyle: styles.backButton,
          headerTintColor: Theme.colors.textHighlighted,
        }}
      />

      {/* Insert Time Screen */}
      {/*TODO: add headerRight and replace Add Solve Time button in newtime*/}
      <Stack.Screen
        name="newtime"
        options={{
          presentation: "modal",
          headerTitle: "Add New Time",
          headerTintColor: Theme.colors.textHighlighted,
          headerStyle: {
            backgroundColor: Theme.colors.backgroundPrimary,
          },
          headerTitleStyle: {
            color: Theme.colors.textPrimary,
            fontWeight: "bold",
          },
          headerLeft: () => (
            <Button
              title="Cancel"
              onPress={() => router.back()}
              color={Theme.colors.textPrimary}
            />
          ),
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
    padding: 5,
  },
  instructions: {
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    color: Theme.colors.textHighlighted,
  },
  backText: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    marginLeft: 8,
    paddingTop: 2,
  },
});
