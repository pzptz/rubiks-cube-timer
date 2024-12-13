import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { Switch } from "@rneui/themed";
import Theme from "@/assets/theme";
import Loading from "@/components/Loading";
import CubeTypePicker from "@/components/CubeTypePicker";
import db from "@/database/db";
import useSession from "@/utils/useSession";
import { settings, loadingContext } from "@/assets/contexts";
import DropDownPicker from "react-native-dropdown-picker";
import PasswordChanger from "@/components/PasswordChanger";

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
  const settingsRef = useRef(null);
  const changedFlag = useRef(false);
  const themeOptions = Object.keys(Theme)
    .filter((key) => key !== "text") // Exclude "text"
    .map((key) => ({
      label: key,
      value: key,
    }));
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);

  // Modal visibility state
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSignOut = async () => {
    if (changedFlag.current) {
      await pushSettings();
    }
    signOut();
  };
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
    } catch (error) {
      // Keep trying until sign out
      setTimeout(() => signOut(), 500);
    }
  };

  const handleCubeTypeChange = (newCubeType) => {
    changedFlag.current = true;
    setCubeType(newCubeType);
  };

  const handleInspectionTimeChange = (shouldHaveIT) => {
    changedFlag.current = true;
    setInspectionTime(shouldHaveIT);
  };

  const setNewTheme = (newTheme) => {
    changedFlag.current = true;
    setThemeChoice(newTheme);
  };

  const loadSettings = async () => {
    setLoading(true);
    try {
      if (session) {
        // Fetch user settings from the database
        const { data, error } = await db
          .from("settings")
          .select()
          .eq("user_id", session.user.id);

        if (error) {
          throw error;
        }
        if (data[0]) {
          setInspectionTime(data[0].inspection_time);
          setThemeChoice(data[0].theme);
          setCubeType(data[0].cube_type);
        } else {
          setInspectionTime(false);
          setThemeChoice("Dark");
          setCubeType(3);
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      // Retry fetching settings after a delay
      setTimeout(() => loadSettings(), 500);
    }
  };

  const pushSettings = async () => {
    try {
      if (session) {
        // Upsert user settings into the database
        const { data, error } = await db
          .from("settings")
          .upsert(settingsRef.current, { onConflict: "user_id" });

        if (error) {
          throw error;
        }

        setLoading(false);
        // No need to push things after we've successfully pushed
        changedFlag.current = false;
      }
    } catch (error) {
      console.log(error);
      // Retry pushing settings after a delay
      setTimeout(() => pushSettings(), 500);
    }
  };
  const handleNewPassword = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    loadSettings();
  }, [session]);

  useEffect(() => {
    if (session) {
      settingsRef.current = {
        cube_type: cubeType,
        theme: themeChoice,
        inspection_time: inspectionTime,
        user_id: session.user.id,
      };
    }
  }, [themeChoice, cubeType, inspectionTime]);

  useFocusEffect(
    React.useCallback(() => {
      if (session) {
        return () => {
          if (changedFlag.current) {
            setLoading(true);
            pushSettings();
          }
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
      {/* User Information */}
      <View style={styles.userContainer}>
        <View style={styles.userTextContainer}>
          <Text
            style={[styles.title, { color: Theme[themeChoice].textPrimary }]}
          >
            Logged in as:{" "}
          </Text>
          <TouchableOpacity onPress={() => handleSignOut()}>
            <Text
              style={[styles.buttonText, { color: Theme[themeChoice].flair }]}
            >
              Sign out{" "}
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={[
            styles.text,
            { paddingBottom: 8, color: Theme[themeChoice].textPrimary },
          ]}
        >
          {session.user.email}
        </Text>
      </View>

      {/* Change Password Row */}
      <View
        style={[
          styles.settingView,
          { borderBottomColor: Theme[themeChoice].textSecondary },
        ]}
      >
        <Text
          style={[
            styles.text,
            { padding: 12, color: Theme[themeChoice].textPrimary },
          ]}
        >
          Change Password:
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Theme[themeChoice].flair }]}
          onPress={handleNewPassword}
        >
          <Text
            style={[
              styles.buttonText,
              { color: Theme[themeChoice].textPrimary },
            ]}
          >
            Change
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inspection Time Setting */}
      <View
        style={[
          styles.settingView,
          { borderBottomColor: Theme[themeChoice].textSecondary },
        ]}
      >
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
          thumbColor={Theme[themeChoice].textPrimary}
          onValueChange={(value) => handleInspectionTimeChange(value)}
        />
      </View>

      {/* Cube Type Setting */}
      <View
        style={[
          styles.settingView,
          { zIndex: 5, borderBottomColor: Theme[themeChoice].textSecondary },
        ]}
      >
        <Text
          style={[
            styles.text,
            { padding: 12, color: Theme[themeChoice].textPrimary },
          ]}
        >
          Cube Type:
        </Text>
        <CubeTypePicker
          themeChoice={themeChoice}
          handleChange={handleCubeTypeChange}
        />
      </View>

      {/* Theme Setting */}
      <View
        style={[
          styles.settingView,
          Platform.OS === "android" ? {} : { zIndex: 3 },
          { borderBottomColor: Theme[themeChoice].textSecondary },
        ]}
      >
        <Text
          style={[
            styles.text,
            { padding: 12, color: Theme[themeChoice].textPrimary },
          ]}
        >
          Theme:
        </Text>
        <View style={{ width: "50%" }}>
          <DropDownPicker
            style={{
              zIndex: 1,
              borderWidth: 0,
              backgroundColor: Theme[themeChoice].flair,
            }}
            textStyle={{
              color: Theme[themeChoice].textPrimary,
              fontSize: Theme.text.textMedium,
              fontWeight: "bold",
            }}
            dropDownContainerStyle={{
              zIndex: 1,
              backgroundColor: Theme[themeChoice].dropDownBackground,
            }}
            tickIconStyle={{
              tintColor: Theme[themeChoice].textPrimary,
            }}
            open={themeSelectorOpen}
            value={themeChoice}
            items={themeOptions}
            setOpen={setThemeSelectorOpen}
            onSelectItem={(item) => setNewTheme(item.value)}
          />
        </View>
      </View>

      {/* Change Password Modal */}
      <PasswordChanger
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  userContainer: {
    width: "100%",
    marginBottom: 36,
  },
  userTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: Theme.text.textMedium,
    fontWeight: "bold",
  },
  text: {
    fontSize: Theme.text.textMedium,
    paddingLeft: 8,
    fontWeight: "bold",
  },
  button: {
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "30%",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: Theme.text.textMedium,
  },
  settingView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  switchWrapper: {
    borderRadius: 16,
    padding: 5,
    width: 50,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
