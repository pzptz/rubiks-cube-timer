import React, { useEffect, useState, useContext } from "react";
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
import { averagesContext } from "@/assets/contexts";
import Theme from "@/assets/theme";
import Loading from "@/components/Loading";

export default function Details() {
  const { id } = useLocalSearchParams(); // Get the solve time ID from the route params
  const [solve, setSolve] = useState(null);
  const setAverages = useContext(averagesContext).setAverages;
  const router = useRouter();

  const fetchSolve = async () => {
    try {
      const { data, error } = await db
        .from("solve_times")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      setSolve(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch solve details.");
    }
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
        <Text style={styles.label}>Time (s)</Text>
        <Text style={styles.value}>{(solve.time / 1000).toFixed(2)}</Text>

        <Text style={styles.label}>ao5 (s)</Text>
        <Text style={styles.value}>
          {solve.ao5 !== null && solve.ao5 !== undefined
            ? (solve.ao5 / 1000).toFixed(2)
            : "-"}
        </Text>

        <Text style={styles.label}>ao12 (s)</Text>
        <Text style={styles.value}>
          {solve.ao12 !== null && solve.ao12 !== undefined
            ? (solve.ao12 / 1000).toFixed(2)
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
