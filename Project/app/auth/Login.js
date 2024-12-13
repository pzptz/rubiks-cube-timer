import { useState } from "react";
import {
  Text,
  Alert,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import db from "@/database/db";
import Theme from "@/assets/theme";
import { router, Redirect } from "expo-router";
import Loading from "@/components/Loading";
import useSession from "../../utils/useSession";
export default function Login({ themeChoice = "Dark" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = Theme[themeChoice];
  const session = useSession();
  const signInWithEmail = async () => {
    setLoading(true);
    try {
      const { data, error } = await db.auth.signInWithPassword({
        email,
        password,
        options: {
          shouldCreateUser: false,
        },
      });
      if (error) {
        Alert.alert(error.message);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to log in");
      // Should not force here, because that could be an infinite loop with invalid shit
      setLoading(false);
    }
  };
  const isSignInDisabled =
    loading || email.length === 0 || password.length === 0;
  if (loading) {
    return <Loading />;
  }
  if (session) {
    return <Redirect href="/" />;
  } else {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.backgroundPrimary }]}
      >
        <StatusBar style="light" />
        <View style={styles.splash}>
          <Image size={50} source={require("@/assets/cube.png")} />
        </View>
        <View style={styles.splash}>
          <Text style={[styles.splashText, { color: theme.textPrimary }]}>
            Rubik's Stopwatch
          </Text>
        </View>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize={"none"}
          style={[
            styles.input,
            {
              color: theme.textPrimary,
              backgroundColor: theme.inputBackground,
            },
          ]}
        />
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Password"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={true}
          autoCapitalize={"none"}
          style={[
            styles.input,
            {
              color: theme.textPrimary,
              backgroundColor: theme.inputBackground,
            },
          ]}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={signInWithEmail}
            disabled={isSignInDisabled}
          >
            <Text
              style={[
                styles.button,
                isSignInDisabled
                  ? { color: Theme[themeChoice].textSecondary }
                  : { color: Theme[themeChoice].flair },
              ]}
            >
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text style={[styles.button, { color: Theme[themeChoice].flair }]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    padding: 12,
    flex: 1,
  },
  splash: {
    alignItems: "center",
    marginBottom: 12,
  },
  splashText: {
    fontWeight: "bold",

    fontSize: 36,
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: {
    width: "100%",
    padding: 16,
  },
  button: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 8,
  },
});
