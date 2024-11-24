import { useEffect, useState } from "react";

import { Redirect, router } from "expo-router";
import { View, Text, Alert, SafeAreaView } from "react-native";
import Login from "@/components/Login";
import db from "@/database/db";
import Loading from "@/components/Loading";

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Default to true for initial load
  const [message, setMessage] = useState("test");

  useEffect(() => {
    setIsLoading(true);

    db.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await db.auth.signOut();
      if (error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Sign out successful.");
      }
    } catch (err) {
      console.error(err);
    }
  };
  if (session) {
    return <Redirect href="/(tabs)/main" />;
  } else if (isLoading) {
    return <Loading />;
  } else {
    return <Login />;
  }
}
