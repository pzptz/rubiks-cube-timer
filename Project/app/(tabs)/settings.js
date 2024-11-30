import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";

import { useRouter } from "expo-router";
import { Switch } from "@rneui/themed";
import Theme from "@/assets/theme";
import Loading from "@/components/Loading";

import db from "@/database/db";
import useSession from "@/utils/useSession";
import { settings } from "@/assets/contexts";
import { useContext, useState } from "react";

export default function Settings() {
  const session = useSession();
  const router = useRouter();
  const setCubeType = useContext(settings).setCubeType;
  const inspectionTime = useContext(settings).inspectionTime;
  const setInspectionTime = useContext(settings).setInspectionTime;
  const signOut = async () => {
    try {
      const { error } = await db.auth.signOut();
      if (error) {
        Alert.alert(error.message);
      } else {
        router.navigate("/");
        Alert.alert("Sign out successful.");
      }
    } catch (err) {
      console.error(err);
    }
  };
  if (!session) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <View style={styles.userTextContainer}>
          <Text style={styles.title}>Logged in as: </Text>
          <TouchableOpacity onPress={() => signOut()}>
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>{session.user.email}</Text>
      </View>
      <Switch
        value={inspectionTime}
        onValueChange={(value) => setInspectionTime(value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  postTitle: {
    padding: 12,
  },
  userContainer: {
    width: "100%",
    marginTop: 12,
    paddingHorizontal: 12,
  },
  userTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.sizes.textMedium,
    fontWeight: "bold",
  },
  text: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.sizes.textMedium,
    paddingLeft: 8,
  },
  buttonText: {
    fontWeight: "bold",
    color: Theme.colors.textHighlighted,
    fontSize: Theme.sizes.textMedium,
  },
});
