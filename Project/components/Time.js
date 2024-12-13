import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Theme from "@/assets/theme";
import millisToTime from "@/utils/millisToTime";
const Time = ({ solve, onPress, themeChoice }) => {
  return (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        {
          borderBottomColor: Theme[themeChoice].border,
          backgroundColor: Theme[themeChoice].cardBackground,
        },
      ]}
      onPress={onPress}
    >
      {/* Time Column (Index) */}
      <View style={styles.timeColumn}>
        <Text
          style={[styles.timeText, { color: Theme[themeChoice].textPrimary }]}
        >
          {millisToTime(solve.time_with_penalty, solve.penalty)}
        </Text>
      </View>

      {/* AO5 Column */}
      <View style={styles.aoColumn}>
        <Text
          style={[styles.aoText, { color: Theme[themeChoice].textSecondary }]}
        >
          {millisToTime(solve.ao5)}
        </Text>
      </View>

      {/* AO12 Column */}
      <View style={styles.aoColumn}>
        <Text
          style={[styles.aoText, { color: Theme[themeChoice].textSecondary }]}
        >
          {millisToTime(solve.ao12)}
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
    textAlign: "center",
  },
  aoText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default Time;
