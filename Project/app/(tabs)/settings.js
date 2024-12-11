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
  const themeChoice = useContext(settings).themeChoice;
  const router = useRouter();
  const setCubeType = useContext(settings).setCubeType;
  const inspectionTime = useContext(settings).inspectionTime;
  const setInspectionTime = useContext(settings).setInspectionTime;
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
      setTimeout(signOut(), 50);
    }
  };
  if (!session || loading) {
    return <Loading themeChoice={themeChoice} />;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Theme[themeChoice].backgroundPrimary },
      ]}
    >
      <View style={styles.userContainer}>
        <View style={styles.userTextContainer}>
          <Text
            style={[styles.title, { color: Theme[themeChoice].textPrimary }]}
          >
            Logged in as:{" "}
          </Text>
          <TouchableOpacity onPress={() => signOut()}>
            <Text
              style={[
                styles.buttonText,
                { color: Theme[themeChoice].textHighlighted },
              ]}
            >
              Sign out{" "}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.text, { color: Theme[themeChoice].textPrimary }]}>
          {session.user.email}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 24,
        }}
      >
        <Text
          style={[
            styles.text,
            { padding: 12, color: Theme[themeChoice].textPrimary },
          ]}
        >
          Inspection Time:{" "}
        </Text>
        {/* Dynamically update text color */}
        <Switch
          value={inspectionTime}
          color={Theme[themeChoice].textHighlighted}
          onValueChange={(value) => setInspectionTime(value)}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 24,
        }}
      >
        <Text
          style={[
            styles.text,
            { padding: 12, color: Theme[themeChoice].textPrimary },
          ]}
        >
          Cube Type:{" "}
        </Text>
        <CubeTypePicker themeChoice={themeChoice} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    paddingLeft: 8,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
