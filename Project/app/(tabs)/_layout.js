import { Tabs } from "expo-router";
import Theme from "@/assets/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
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
            <Entypo name="stopwatch" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          header: ProfileHeader,
          tabBarLabel: "Settings",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome size={size} name="user" color={color} />
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
