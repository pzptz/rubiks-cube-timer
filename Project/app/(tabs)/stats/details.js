import React, { useEffect, useState, useContext } from "react";
import millisToTime from "@/utils/millisToTime";
import date from "@/utils/timeAgo";
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import db from "@/database/db";
import { useRouter, useLocalSearchParams } from "expo-router";
import Theme from "@/assets/theme";
import Loading from "@/components/Loading";

export default function Details() {
  const { id, time, ao5, ao12, scramble, created_at } = useLocalSearchParams(); // Get the solve time ID from the route params
  const [solve, setSolve] = useState(null);
  const router = useRouter();

  const fetchSolve = () => {
    const data = {
      time: time,
      ao5: ao5,
      ao12: ao12,
      scramble: scramble,
      created_at: created_at,
    };
    setSolve(data);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Solve",
      "Are you sure you want to delete this solve time?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: confirmDelete },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      const { error } = await db.from("solve_times").delete().eq("id", id);

      if (error) {
        throw error;
      }
      Alert.alert("Deleted", "Solve time has been deleted.");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to delete solve.");
    }
  };

  useEffect(() => {
    fetchSolve();
  }, [id]);

  if (!solve) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Timestamp</Text>
        <Text style={styles.value}>{date(created_at)}</Text>
        <Text style={styles.label}>Scramble</Text>
        <Text style={styles.value}>{scramble}</Text>
        <Text style={styles.label}>Time (s)</Text>
        <Text style={styles.value}>{millisToTime(time)}</Text>

        <Text style={styles.label}>ao5 (s)</Text>
        <Text style={styles.value}>
          {solve.ao5 !== null && solve.ao5 !== undefined
            ? millisToTime(ao5)
            : "-"}
        </Text>

        <Text style={styles.label}>ao12 (s)</Text>
        <Text style={styles.value}>
          {solve.ao12 !== null && solve.ao12 !== undefined
            ? millisToTime(ao12)
            : "-"}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete Time</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
    padding: 16,
  },
  detailContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    marginTop: 12,
  },
  value: {
    fontSize: 20,
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  button: {
    backgroundColor: Theme.colors.textHighlighted,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
  },
});
