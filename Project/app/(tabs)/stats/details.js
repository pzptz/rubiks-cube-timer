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
  const { id, time, ao5, ao12, scramble, created_at, user_id, penalty } =
    useLocalSearchParams(); // Get the solve time ID from the route params
  const [solve, setSolve] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const setPenalty = (newPenalty) => {
    let penaltyString = "";
    if (newPenalty == 0) {
      penaltyString = "No penalty on this solve?";
    } else if (newPenalty == 1) {
      penaltyString = "+2 on this solve?";
    } else {
      penaltyString = "DNF on this solve?";
    }
    Alert.alert("Penalty", penaltyString, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        style: "default",
        onPress: () => confirmPenalty(newPenalty),
      },
    ]);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const { error } = await db.from("solve_times").delete().eq("id", id);
      if (error) {
        throw error;
      }
      setLoading(false);
      Alert.alert("Deleted", "Solve time has been deleted.");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to delete solve.");
    }
  };
  const confirmPenalty = async (newPenalty) => {
    setLoading(true);
    try {
      const penaltyObject = {
        solve_id: id,
        user_id: user_id,
        penalty: newPenalty,
      };
      const { error } = await db
        .from("penalties")
        .update(penaltyObject)
        .eq("solve_id", id)
        .select();
      if (error) {
        throw error;
      }
      setLoading(false);
      Alert.alert("Penalty saved");
      router.back();
    } catch (error) {
      console.log(error);
      setTimeout(confirmPenalty(newPenalty), 50);
    }
  };
  useEffect(() => {
    fetchSolve();
  }, [id]);

  if (!solve || loading) {
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
        <Text style={styles.value}>{millisToTime(time, penalty)}</Text>

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
        <TouchableOpacity style={styles.button} onPress={() => setPenalty(0)}>
          <Text style={styles.buttonText}>No Penalty</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setPenalty(1)}>
          <Text style={styles.buttonText}>+2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setPenalty(2)}>
          <Text style={styles.buttonText}>DNF</Text>
        </TouchableOpacity>
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
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: 8,
    paddingBottom: 32,
    height: "15%",
  },
  button: {
    backgroundColor: Theme.colors.textHighlighted,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    width: "30%",
    justifyContent: "center",
  },
  buttonText: {
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    textAlign: "center",
  },
});
