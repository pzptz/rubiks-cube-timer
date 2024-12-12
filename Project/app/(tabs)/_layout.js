import { Tabs } from "expo-router";
import Theme from "@/assets/theme";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  averagesContext,
  runningContext,
  settings,
  loadingContext,
} from "@/assets/contexts";

import { StyleSheet, View, SafeAreaView, Text, StatusBar } from "react-native";
import { useState, useContext } from "react";

export default function TabLayout() {
  const [averages, setAverages] = useState(null);
  const [isRunning, setIsRunning] = useState(0);
  const [cubeType, setCubeType] = useState(3);
  const [inspectionTime, setInspectionTime] = useState(false);
  const [themeChoice, setThemeChoice] = useState("Dark");
  const [loading, setLoading] = useState(false);
  const SettingsHeader = ({ navigation, route, options }) => {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Theme[themeChoice].backgroundPrimary },
        ]}
      >
        <View style={styles.header}>
          <Text
            style={[styles.text, { color: Theme[themeChoice].textPrimary }]}
          >
            Settings
          </Text>
        </View>
      </SafeAreaView>
    );
  };
  const StatsHeader = ({ navigation, route, options }) => {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Theme[themeChoice].backgroundPrimary },
        ]}
      >
        <View style={styles.header}>
          <Text
            style={[styles.text, { color: Theme[themeChoice].textPrimary }]}
          >
            Stats
          </Text>
        </View>
      </SafeAreaView>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Theme[themeChoice].backgroundPrimary,
      }}
    >
      <SafeAreaProvider
        style={{
          backgroundColor: Theme[themeChoice].backgroundPrimary,
          paddingTop: 40,
        }}
      >
        <StatusBar
          translucent={true}
          backgroundColor={Theme[themeChoice].backgroundPrimary}
          barStyle={Theme[themeChoice].statusbar}
        />
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
                themeChoice: themeChoice,
                setThemeChoice: setThemeChoice,
              }}
            >
              <loadingContext.Provider
                value={{ loading: loading, setLoading: setLoading }}
              >
                <Tabs
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: Theme[themeChoice].backgroundPrimary, // Dynamically update header background
                    },
                    tabBarStyle: {
                      backgroundColor: Theme[themeChoice].backgroundPrimary, // Dynamically update tab bar background
                      display: isRunning == 0 ? "flex" : "none",
                    },
                    tabBarActiveTintColor: Theme[themeChoice].flair, // Dynamically update active tint color
                    tabBarInactiveTintColor: Theme[themeChoice].tabInactive,
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
                      lazy: false, // We want data to be pulled immediately
                      tabBarLabel: "Stats",
                      tabBarIcon: ({ size, color }) => (
                        <Ionicons
                          name="stats-chart"
                          size={size}
                          color={color}
                        />
                      ),
                    }}
                  />
                  <Tabs.Screen
                    name="settings"
                    options={{
                      header: SettingsHeader,
                      lazy: false, // We want settings to be pulled immediately
                      tabBarLabel: "Settings",
                      tabBarIcon: ({ size, color }) => (
                        <MaterialIcons
                          name="settings"
                          size={size}
                          color={color}
                        />
                      ),
                    }}
                  />
                </Tabs>
              </loadingContext.Provider>
            </settings.Provider>
          </runningContext.Provider>
        </averagesContext.Provider>
      </SafeAreaProvider>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  header: {
    alignItems: "center",
  },
  text: {
    fontSize: Theme.text.textXL,
    fontWeight: "bold",
    padding: 5,
  },
});
