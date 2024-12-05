import { useEffect, useState, useContext, useRef } from "react";
const binarySearch = require("binary-search");
import React from "react";
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
import { useRouter, useFocusEffect } from "expo-router";
import Time from "@/components/Time";

export default function Statistics() {
  const session = useSession();
  const [tableData, setTableData] = useState([]); // for this screen
  const expectedUpdates = useRef(0);
  const updateRef = useRef([]);
  const [latestRequest, setRequested] = useState(0);
  const dataRef = useRef(tableData);
  const setAverages = useContext(averagesContext).setAverages; // for the main screen
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);
  const idComparator = (a, b) => {
    return b.id - a.id;
  };
  const fetchData = async (initialEnd = 100) => {
    try {
      if (session) {
        console.log("Fetching data");
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
  const extendList = async () => {
    // This async function allows us to extend the list whenever we scroll out of bounds
    let currentOffset = 0;
    if (tableData.length > latestRequest) {
      currentOffset = tableData.length;
      try {
        const { data, error } = await db
          .from("solve_times")
          .select()
          .eq("user_id", session.user.id)
          .order("id", { ascending: false })
          .range(currentOffset, currentOffset + 20);
        if (error) throw error;
        setTableData([...tableData, ...data]);
      } catch (error) {
        console.log(error);
        // This is to guarantee we get the data, eventually we'll remove this log but it's to avoid internet errors
        setTimeout(() => extendList(), 500);
      }
      setRequested(tableData.length);
    }
  };
  const handleInsert = (payload) => {
    // also only here if user_id matches
    const length = dataRef.current.length;
    if (length >= 11) {
      // There were at least 11 times before this one, so we will expect an update to both ao5 and ao12
      expectedUpdates.current = 2;
    } else if (length >= 4) {
      // Not enough for ao12 so we expect only one update
      expectedUpdates.current = 1;
    } else {
      // No updates will come.
      setTableData([payload.new, ...dataRef.current]);
      return;
    }
  };
  const handleUpdate = (payload) => {
    // By the way, we are only here when payload.user_id = session.user_id.
    if (dataRef.current) {
      // tableData is not empty, find the index of the item
      const index = binarySearch(dataRef.current, payload.new, idComparator);
      if (index < 0) {
        // This came from an insert, just wait for the last update and insert it into the list.
        if (expectedUpdates.current <= 1) {
          setTableData([payload.new, ...dataRef.current]); //O(n), but only one time
        }
        expectedUpdates.current = expectedUpdates.current - 1;
      } else {
        if (expectedUpdates.current == 0) {
          // From a penalty update
          if (index >= 11) {
            expectedUpdates.current = 17;
          } else if (index <= 4) {
            expectedUpdates.current = 2 * (index + 1);
          } else {
            expectedUpdates.current = 10 + index - 4;
          }
          updateRef.current.push({
            index,
            type: "penalty",
            payload: payload.new,
          });
        } else {
          updateRef.current.push({
            index,
            type: "update",
            payload: payload.new,
          });
          if (expectedUpdates.current == 1) {
            let newTable = [...dataRef.current]; //O(n), but only one time
            updateRef.current.forEach((update) => {
              if (update.type == "delete") {
                newTable.splice(update.index, 1);
              } else newTable[update.index] = update.payload;
              // Apply the updates
            });
            // Set the table
            updateRef.current = [];
            setTableData([...newTable]);
          }
          expectedUpdates.current = expectedUpdates.current - 1;
        }
      }
    } else {
      // tableData is empty, create the new array
      setTableData([payload.new]);
    }
    setAverages({ ao5: payload.new.ao5, ao12: payload.new.ao12 });
  };
  const handleDelete = (payload) => {
    const index = binarySearch(dataRef.current, payload.old, idComparator);
    // If index is not >= 0, some other user_id had a deletion. disregard.
    if (index >= 0) {
      if (index >= 11) {
        expectedUpdates.current = 15;
      } else if (index <= 4) {
        expectedUpdates.current = 2 * index;
      } else {
        expectedUpdates.current = 8 + index - 4;
      }
      if (expectedUpdates.current == 0) {
        let newTable = [...dataRef.current];
        newTable.splice(index, 1);
        setTableData([...newTable]);
      } else {
        updateRef.current.push({ index, type: "delete" });
        // Mark the row for death
      }
    }
  };
  useEffect(() => {
    fetchData();
    if (session) {
      const timesInsert = db
        .channel("times-insert")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "solve_times",
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => handleInsert(payload)
        )
        .subscribe();
      const timesUpdate = db
        .channel("times-update")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "solve_times",
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => handleUpdate(payload)
        )
        .subscribe();
      const timesDelete = db
        .channel("times-delete")
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "solve_times",
          },
          (payload) => handleDelete(payload)
        )
        .subscribe();
      return () => {
        db.removeChannel(timesInsert);
        db.removeChannel(timesUpdate);
        db.removeChannel(timesDelete);
      };
    }
  }, [session]);
  useEffect(() => {
    dataRef.current = tableData;
  }, [tableData]);
  const handleNewTime = () => {
    router.push("/stats/newtime");
  };
  // HUGE optimization, only render if we need to, otherwise only keep the first element for main screen avg purposes. LETS GOOO
  useFocusEffect(
    React.useCallback(() => {
      setShouldRender(true);
      return () => {
        setShouldRender(false);
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );
  const renderItem = ({ item }) => (
    <Time
      solve={item}
      onPress={() =>
        router.push(
          `/stats/details?id=${item.id}&time=${item.time_with_penalty}&ao5=${item.ao5}&ao12=${item.ao12}&scramble=${item.scramble}&created_at=${item.created_at}&user_id=${item.user_id}`
        )
      }
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
        data={shouldRender ? tableData : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={() => extendList()}
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
