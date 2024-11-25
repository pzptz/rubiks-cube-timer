import { Tabs } from "expo-router";
import Theme from "@/assets/theme";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View, SafeAreaView, Text } from "react-native";

export default function TabLayout() {
  const FeedHeader = ({ navigation, route, options }) => {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>Timer</Text>
        </View>
      </SafeAreaView>
    );
  };
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
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Theme.colors.backgroundPrimary,
        },
        tabBarStyle: {
          backgroundColor: Theme.colors.backgroundPrimary,
        },
        tabBarActiveTintColor: Theme.colors.iconHighlighted,
      }}
    >
      <Tabs.Screen
        name="main"
        options={{
          header: FeedHeader,
          tabBarLabel: "Timer",

          tabBarIcon: ({ size, color }) => (
            <Entypo name="stopwatch" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          header: StatsHeader,
          tabBarLabel: "Stats",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="stats-chart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          header: ProfileHeader,
          tabBarLabel: "Settings",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.backgroundPrimary,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "30%",
  },
  text: {
    fontSize: 24,
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
  },
});
