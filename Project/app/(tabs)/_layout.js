import { Tabs } from "expo-router";
import Theme from "@/assets/theme";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { averagesContext, runningContext, settings } from "@/assets/contexts";

import { StyleSheet, View, SafeAreaView, Text } from "react-native";
import { useState } from "react";

export default function TabLayout() {
  const [averages, setAverages] = useState({ ao5: -1, ao12: -1 });
  const [isRunning, setIsRunning] = useState(0);
  const [cubeType, setCubeType] = useState(3);
  const [inspectionTime, setInspectionTime] = useState(false);
  const ProfileHeader = ({ navigation, route, options }) => {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>My Profile</Text>
        </View>
      </SafeAreaView>
    );
  };
  const StatsHeader = ({ navigation, route, options }) => {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>Stats</Text>
        </View>
      </SafeAreaView>
    );
  };
  return (
    <SafeAreaProvider>
      <averagesContext.Provider
        value={{ averages: averages, setAverages: setAverages }}
      >
        <runningContext.Provider
          value={{ isRunning: isRunning, setIsRunning: setIsRunning }}
        >
          <settings.Provider
            value={{
              cubeType: cubeType,
              setCubeType: setCubeType,
              inspectionTime: inspectionTime,
              setInspectionTime: setInspectionTime,
            }}
          >
            <Tabs
              screenOptions={{
                headerStyle: {
                  backgroundColor: Theme.colors.backgroundPrimary,
                },
                tabBarStyle: {
                  backgroundColor: Theme.colors.backgroundPrimary,
                  display: isRunning == 0 ? "flex" : "none",
                },
                tabBarActiveTintColor: Theme.colors.iconHighlighted,
              }}
            >
              <Tabs.Screen
                name="timer"
                options={{
                  tabBarLabel: "Timer",
                  headerShown: false,
                  tabBarIcon: ({ size, color }) => (
                    <Entypo name="stopwatch" size={size} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="stats"
                options={{
                  header: StatsHeader,
                  lazy: false,
                  tabBarLabel: "Stats",
                  tabBarIcon: ({ size, color }) => (
                    <Ionicons name="stats-chart" size={size} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="settings"
                options={{
                  header: ProfileHeader,
                  tabBarLabel: "Settings",
                  tabBarIcon: ({ size, color }) => (
                    <MaterialIcons name="settings" size={size} color={color} />
                  ),
                }}
              />
            </Tabs>
          </settings.Provider>
        </runningContext.Provider>
      </averagesContext.Provider>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.backgroundPrimary,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    padding: 5,
  },
});
