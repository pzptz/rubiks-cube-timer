import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { Switch } from "@rneui/themed";
import Theme from "@/assets/theme";
import Loading from "@/components/Loading";
import CubeTypePicker from "@/components/CubeTypePicker";
import db from "@/database/db";
import useSession from "@/utils/useSession";
import { settings, loadingContext } from "@/assets/contexts";
import { useContext, useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
export default function Settings() {
  const session = useSession();
  const themeChoice = useContext(settings).themeChoice;
  const setThemeChoice = useContext(settings).setThemeChoice;
  const cubeType = useContext(settings).cubeType;
  const setCubeType = useContext(settings).setCubeType;
  const router = useRouter();
  const inspectionTime = useContext(settings).inspectionTime;
  const setInspectionTime = useContext(settings).setInspectionTime;
  const loading = useContext(loadingContext).loading;
  const setLoading = useContext(loadingContext).setLoading;
  const themeOptions = Object.keys(Theme).map((key) => ({
    label: key,
    value: key,
  }));
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
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
  const loadSettings = async () => {
    try {
      if (session) {
        // list of jsons, each with fields {id, created_at, user_id, cube_type, scramble, time, ao5, ao12}
        const { data, error } = await db
          .from("settings")
          .select()
          .eq("user_id", session.user.id);
        if (error) {
          throw error;
        }
        setLoading(false);
        setInspectionTime(data[0].inspection_time);
        setThemeChoice(data[0].theme);
        setCubeType(data[0].cube_type);
      }
    } catch (error) {
      console.log(error);
      // This is to guarantee we get the data, eventually we'll remove this log but it's to avoid internet errors
      setTimeout(() => loadSettings(), 500);
    }
  };
  const pushSettings = async (settingsJSON) => {
    try {
      if (session) {
        console.log(settingsJSON);
        // list of jsons, each with fields {id, created_at, user_id, cube_type, scramble, time, ao5, ao12}
        const { data, error } = await db
          .from("settings")
          .upsert(settingsJSON, { onConflict: "user_id" });
        if (error) {
          throw error;
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      // This is to guarantee we get the data, eventually we'll remove this log but it's to avoid internet errors
      setTimeout(() => pushSettings(settingsJSON), 500);
    }
  };
  useEffect(() => {
    loadSettings();
  }, [session]);

  useFocusEffect(
    React.useCallback(() => {
      if (session) {
        console.log("foo");
        return () => {
          console.log("moo");
          setLoading(true);
          const settingsJSON = {
            cube_type: cubeType,
            theme: themeChoice,
            inspection_time: inspectionTime,
            user_id: session.user.id,
          };
          pushSettings(settingsJSON);
        };
      }
    }, [session])
  );
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
              style={[styles.buttonText, { color: Theme[themeChoice].flair }]}
            >
              Sign out{" "}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.text, { color: Theme[themeChoice].textPrimary }]}>
          {session.user.email}
        </Text>
      </View>
      <View style={styles.settingView}>
        <Text
          style={[
            styles.text,
            { padding: 12, color: Theme[themeChoice].textPrimary },
          ]}
        >
          Inspection Time:{" "}
        </Text>
        <Switch
          value={inspectionTime}
          color={Theme[themeChoice].flair}
          onValueChange={(value) => setInspectionTime(value)}
        />
      </View>
      <View style={styles.settingView}>
        <Text
          style={[
            styles.text,
            { padding: 12, color: Theme[themeChoice].textPrimary },
          ]}
        >
          Cube Type:
        </Text>
        <CubeTypePicker themeChoice={themeChoice} />
      </View>
      <View style={styles.settingView}>
        <Text
          style={[
            styles.text,
            { padding: 12, color: Theme[themeChoice].textPrimary },
          ]}
        >
          Theme:
        </Text>
        <View style={{ zIndex: 100, width: "40%" }}>
          <DropDownPicker
            style={{
              borderWidth: 0,
              backgroundColor: Theme[themeChoice].flair,
            }}
            textStyle={{
              color: Theme[themeChoice].textPrimary,
              fontSize: 16,
              fontWeight: "bold",
            }}
            dropDownContainerStyle={{
              backgroundColor: Theme[themeChoice].dropDownBackground,
            }}
            open={themeSelectorOpen}
            value={themeChoice}
            items={themeOptions}
            setOpen={setThemeSelectorOpen}
            onSelectItem={(item) => setThemeChoice(item.value)}
          />
        </View>
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
  settingView: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
  },
});
