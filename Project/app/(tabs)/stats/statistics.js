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
import { averagesContext, settings, loadingContext } from "@/assets/contexts";
import useSession from "@/utils/useSession";
import Theme from "@/assets/theme";
import { useRouter, useFocusEffect } from "expo-router";
import Time from "@/components/Time";
import Loading from "@/components/Loading";
import CubeTypePicker from "@/components/CubeTypePicker";
export default function Statistics() {
  const themeChoice = useContext(settings).themeChoice;
  const cubeType = useContext(settings).cubeType;
  const setCubeType = useContext(settings).setCubeType;
  const session = useSession();
  const [tableData, setTableData] = useState([]); // for this screen
  const expectedUpdates = useRef(0);
  const updateRef = useRef([]);
  const [latestRequest, setRequested] = useState(0);
  const dataRef = useRef(tableData);
  const tableBufferRef = useRef([]);
  const setAverages = useContext(averagesContext).setAverages; // for the main screen
  const router = useRouter();
  const shouldRender = useRef(false);
  const loading = useContext(loadingContext).loading;
  const setLoading = useContext(loadingContext).setLoading;
  const idComparator = (a, b) => {
    return b.id - a.id;
  };
  const fetchData = async (initialEnd = 100) => {
    setLoading(true);
    try {
      if (session) {
        console.log("Fetching data");
        // list of jsons, each with fields {id, created_at, user_id, cube_type, scramble, time, ao5, ao12}
        const { data, error } = await db
          .from("solve_times")
          .select()
          .eq("user_id", session.user.id)
          .eq("cube_type", cubeType)
          .order("id", { ascending: false })
          .range(0, initialEnd);
        if (error) {
          throw error;
        }
        setLoading(false);
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
          .eq("cube_type", cubeType)
          .order("id", { ascending: false })
          .range(currentOffset, currentOffset + 100);
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
    expectedUpdates.current = 2;
  };
  const handleUpdate = (payload) => {
    // By the way, we are only here when payload.user_id = session.user_id.
    if (dataRef.current) {
      // tableData is not empty, find the index of the item
      const index = binarySearch(dataRef.current, payload.new, idComparator);
      if (index < 0) {
        // This came from an insert, just wait for the last update and insert it into the list.
        if (expectedUpdates.current <= 1) {
          if (shouldRender.current) {
            setTableData([payload.new, ...dataRef.current]);
          } else {
            tableBufferRef.current.push(payload.new);
          } //O(n), but only one time
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
  const handleDeleteAll = () => {
    if (tableData.length === 0) {
      Alert.alert("No Records", "There are no records to delete.");
      return;
    }
    if (session) {
      Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete all times? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: confirmDeleteAll,
          },
        ]
      );
    } else {
      Alert.alert("Error", "User session not found.");
    }
  };
  const confirmDeleteAll = async () => {
    setLoading(true);
    try {
      const { error } = await db
        .from("solve_times")
        .delete()
        .eq("user_id", session.user.id)
        .eq("cube_type", cubeType);
      if (error) {
        throw error;
      }
      setTableData([]); // Clear the table data locally
      setAverages({ ao5: null, ao12: null }); // Reset averages
      setLoading(false);
      Alert.alert("Success", "All times have been deleted.");
    } catch (error) {
      console.log(error);
      setTimeout(() => confirmDeleteAll(), 500);
    }
  };
  const needFetch = () => {
    let lastSeen = 0;
    for (let i = 0; i < tableBufferRef.current.length; i++) {
      if (tableBufferRef.current[i].id == lastSeen) {
        return true;
      }
      lastSeen = tableBufferRef.current[i].id;
    }
    return false;
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
  }, [session, cubeType]);
  useEffect(() => {
    dataRef.current = tableData;
  }, [tableData]);
  const handleNewTime = () => {
    router.push("/stats/newtime");
  };
  // HUGE optimization, only render if we need to, otherwise only keep the first element for main screen avg purposes. LETS GOOO
  useFocusEffect(
    React.useCallback(() => {
      shouldRender.current = true;
      tableBufferRef.current = [
        ...tableBufferRef.current.reverse(),
        ...dataRef.current,
      ];
      if (needFetch()) {
        fetchData(latestRequest);
      } else {
        setTableData(tableBufferRef.current);
        tableBufferRef.current = [];
      }
      return () => {
        shouldRender.current = false;
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );
  const renderItem = ({ item }) => (
    <Time
      solve={item}
      themeChoice={themeChoice}
      onPress={() =>
        router.push(
          `/stats/details?id=${item.id}&time=${item.time_with_penalty}&ao5=${item.ao5}&ao12=${item.ao12}&scramble=${item.scramble}&created_at=${item.created_at}&user_id=${item.user_id}&penalty=${item.penalty}&cube_type=${item.cube_type}`
        )
      }
    />
  );
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
      {/* Add time button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Theme[themeChoice].flair }]}
          onPress={handleNewTime}
        >
          <Text
            style={[
              styles.buttonText,
              { color: Theme[themeChoice].textPrimary },
            ]}
          >
            Add Time
          </Text>
        </TouchableOpacity>
        <CubeTypePicker themeChoice={themeChoice} handleChange={setCubeType} />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Theme[themeChoice].flair }]}
          onPress={handleDeleteAll}
        >
          <Text
            style={[
              styles.buttonText,
              { color: Theme[themeChoice].textPrimary },
            ]}
          >
            Delete All
          </Text>
        </TouchableOpacity>
      </View>

      {/* FlatList with Header */}
      <FlatList
        data={shouldRender.current ? tableData : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={() => extendList()}
        ListHeaderComponent={
          <View
            style={[
              styles.headerRow,
              {
                borderBottomColor: Theme[themeChoice].border,
                backgroundColor: Theme[themeChoice].headerBackground,
              },
            ]}
          >
            <Text
              style={[
                styles.headerText,
                { color: Theme[themeChoice].textPrimary },
              ]}
            >
              Time
            </Text>
            <Text
              style={[
                styles.headerText,
                { color: Theme[themeChoice].textPrimary },
              ]}
            >
              ao5
            </Text>
            <Text
              style={[
                styles.headerText,
                { color: Theme[themeChoice].textPrimary },
              ]}
            >
              ao12
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text
            style={[
              styles.emptyText,
              { color: Theme[themeChoice].textSecondary },
            ]}
          >
            No records found.
          </Text>
        }
        contentContainerStyle={tableData.length === 0 && styles.emptyContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 8,
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: Theme.text.textMedium,
    fontWeight: "bold",

    textAlign: "center",
    flex: 1,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: Theme.text.textMedium,
  },
});
