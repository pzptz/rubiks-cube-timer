import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Switch } from "@rneui/themed";
import Theme from "@/assets/theme";
import Loading from "@/components/Loading";
import CubeTypePicker from "@/components/CubeTypePicker";
import db from "@/database/db";
import useSession from "@/utils/useSession";
import { settings } from "@/assets/contexts";
import { useContext, useState } from "react";

export default function Settings() {
  const session = useSession();
  const router = useRouter();
  const { setCubeType, inspectionTime, setInspectionTime } =
    useContext(settings);
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await db.auth.signOut();
      if (error) {
        throw error;
      } else {
        setLoading(false);
        router.navigate("/");
        Alert.alert("Sign out successful.");
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  if (!session || loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <View style={styles.userTextContainer}>
          <Text style={styles.title}>Logged in as:</Text>
          <TouchableOpacity onPress={signOut}>
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>{session.user.email}</Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.text}>Inspection Time:</Text>
        <Switch
          value={inspectionTime}
          onValueChange={(value) => setInspectionTime(value)}
          color={Theme.colors.iconHighlighted}
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.text}>Cube Type:</Text>
        <CubeTypePicker />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  userContainer: {
    width: "100%",
    marginBottom: 24,
  },
  userTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  buttonText: {
    fontWeight: "bold",
    color: Theme.colors.textHighlighted,
    fontSize: Theme.sizes.textMedium,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.borderColor,
  },
});
