import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Theme from "@/assets/theme";

const Time = ({ solve, onPress }) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      {/* Time Column (Index) */}
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{(solve.time / 1000).toFixed(3)}</Text>
      </View>

      {/* AO5 Column */}
      <View style={styles.aoColumn}>
        <Text style={styles.aoText}>
          {solve.ao5 !== null && solve.ao5 !== undefined
            ? (solve.ao5 / 1000).toFixed(3)
            : "-"}
        </Text>
      </View>

      {/* AO12 Column */}
      <View style={styles.aoColumn}>
        <Text style={styles.aoText}>
          {solve.ao12 !== null && solve.ao12 !== undefined
            ? (solve.ao12 / 1000).toFixed(3)
            : "-"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    backgroundColor: Theme.colors.cardBackground,
    alignItems: "center",
  },
  timeColumn: {
    flex: 1,
    alignItems: "center",
  },
  aoColumn: {
    flex: 1,
    alignItems: "center",
  },
  timeText: {
    fontSize: 16,
    color: Theme.colors.textPrimary,
    textAlign: "center",
  },
  aoText: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
});

export default Time;
