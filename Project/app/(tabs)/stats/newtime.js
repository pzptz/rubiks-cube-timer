import { useContext, useState } from "react";

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import db from "@/database/db";
import { settings, loadingContext } from "@/assets/contexts";
import useSession from "@/utils/useSession";
import { useRouter } from "expo-router";
import Theme from "@/assets/theme";
import Loading from "@/components/Loading";
import CubeTypePicker from "@/components/CubeTypePicker";
export default function NewTime() {
  const themeChoice = useContext(settings).themeChoice;
  const [time, setTime] = useState("");
  const [scramble, setScramble] = useState("");
  const session = useSession();
  const loading = useContext(loadingContext).loading;
  const setLoading = useContext(loadingContext).setLoading;
  const router = useRouter();
  const cubeType = useContext(settings).cubeType;
  const handleSubmit = async () => {
    // Validate inputs
    if (!time || isNaN(time)) {
      Alert.alert("Invalid Input", "Please enter a valid time in seconds.");
      return;
    }

    // Convert time to milliseconds (assuming time is in seconds)
    const timeMs = parseFloat(time) * 1000;
    setLoading(true);
    try {
      const { data, error } = await db.from("solve_times").insert([
        {
          user_id: session.user.id,
          scramble: scramble != "" ? scramble.trim() : "Manually inserted time",
          time: timeMs,
          time_with_penalty: timeMs,
          ao5: null, // You might want to recalculate averages after insertion
          ao12: null,
          cube_type: cubeType,
        },
      ]);

      if (error) {
        throw error;
      }

      // Optionally, refetch data or update averages here
      setLoading(false);
      Alert.alert("Success", "New solve time added.");
      router.back();
    } catch (error) {
      console.log(error);
      setTimeout(handleSubmit(), 50);
    }
  };
  if (loading) {
    return <Loading themeChoice={themeChoice} />;
  }
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Theme[themeChoice].backgroundPrimary },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <CubeTypePicker themeChoice={themeChoice} />
      </View>

      <View style={styles.formGroup}>
        <Text
          style={[styles.label, { color: Theme[themeChoice].textSecondary }]}
        >
          Scramble (optional):
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: Theme[themeChoice].border,
              color: Theme[themeChoice].textPrimary,
              backgroundColor: Theme[themeChoice].inputBackground,
            },
          ]}
          placeholder="Enter scramble here..."
          placeholderTextColor={Theme[themeChoice].textSecondary}
          value={scramble}
          onChangeText={setScramble}
        />
      </View>
      <View style={styles.formGroup}>
        <Text
          style={[styles.label, { color: Theme[themeChoice].textSecondary }]}
        >
          Time (seconds):
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: Theme[themeChoice].border,
              color: Theme[themeChoice].textPrimary,
              backgroundColor: Theme[themeChoice].inputBackground,
            },
          ]}
          placeholder="Enter time here..."
          placeholderTextColor={Theme[themeChoice].textSecondary}
          keyboardType="numeric"
          value={time}
          onChangeText={setTime}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Theme[themeChoice].flair }]}
          onPress={handleSubmit}
        >
          <Text
            style={[
              styles.buttonText,
              { color: Theme[themeChoice].textPrimary },
            ]}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formGroup: {
    padding: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    fontWeight: "bold",
  },
});
