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
import { settings } from "@/assets/contexts";
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
  const [loading, setLoading] = useState(false);
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
    return <Loading />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <CubeTypePicker />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Scramble (optional):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter scramble here..."
          value={scramble}
          onChangeText={setScramble}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Time (seconds):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter time here..."
          keyboardType="numeric"
          value={time}
          onChangeText={setTime}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.dark.backgroundPrimary,
  },
  formGroup: {
    padding: 24,
  },
  label: {
    fontSize: 16,
    color: Theme.dark.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.dark.border,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    color: Theme.dark.textPrimary,
    backgroundColor: Theme.dark.inputBackground,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  button: {
    backgroundColor: Theme.dark.textHighlighted,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: Theme.dark.textPrimary,
    fontWeight: "bold",
  },
});
