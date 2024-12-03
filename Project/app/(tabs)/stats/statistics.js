import { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import db from "@/database/db";
import { averagesContext } from "@/assets/contexts";
import useSession from "@/utils/useSession";
import Theme from "@/assets/theme";
import { useRouter } from "expo-router";
import Time from "@/components/Time";

export default function Statistics() {
  const session = useSession();
  const [tableData, setTableData] = useState([]); // for this screen
  const setAverages = useContext(averagesContext).setAverages; // for the main screen
  const router = useRouter();
  const fetchData = async () => {
    try {
      if (session) {
        // list of jsons, each with fields {id, created_at, user_id, cube_type, scramble, time, ao5, ao12}
        const { data, error } = await db
          .from("solve_times")
          .select()
          .eq("user_id", session.user.id)
          .order("id", { ascending: false });
        if (error) {
          throw error;
        }
        setTableData(data);
        if (data && data.length > 0) {
          setAverages({ ao5: data[0].ao5, ao12: data[0].ao12 });
        } else {
          setAverages({ ao5: null, ao12: null });
        }
      }
    } catch (error) {
      console.log(error);
      // This is to guarantee we get the data, eventually we'll remove this log but it's to avoid internet errors
      setTimeout(() => fetchData(), 500);
    }
  };
  // TODO: Akshar will add live listener to auto update on db changes, and also infinite scroll. All Peter must do for now is render the tableData
  // And make it navigable. Also add a button to manually insert times.
  useEffect(() => {
    fetchData();
  }, [session]);
  const handleNewTime = () => {
    router.push("/stats/newtime");
  };
  const renderItem = ({ item }) => (
    <Time
      solve={item}
      onPress={() => router.push(`/stats/details?id=${item.id}`)}
    />
  );
  return (
    <SafeAreaView style={styles.container}>
      {/* Add time button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNewTime}>
          <Text style={styles.buttonText}>Add Time</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList with Header */}
      <FlatList
        data={tableData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={[styles.headerText, styles.timeColumn]}>Time</Text>
            <Text style={[styles.headerText, styles.aoColumn]}>ao5</Text>
            <Text style={[styles.headerText, styles.aoColumn]}>ao12</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No records found.</Text>
        }
        contentContainerStyle={tableData.length === 0 && styles.emptyContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
    padding: 16,
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    backgroundColor: Theme.colors.headerBackground,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
    textAlign: "center",
  },
  timeColumn: {
    flex: 1,
    alignItems: "center",
  },
  aoColumn: {
    flex: 1,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: Theme.colors.textSecondary,
    fontSize: 16,
  },
});
