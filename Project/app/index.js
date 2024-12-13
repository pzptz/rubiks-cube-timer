import { useEffect, useState } from "react";

import { Redirect, router } from "expo-router";
import { View, Text, Alert, SafeAreaView } from "react-native";
import db from "@/database/db";
import Loading from "@/components/Loading";
import Login from "@/app/auth/Login";

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Default to true for initial load

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
  if (session) {
    return <Redirect href="/(tabs)/timer/main" />;
  } else if (isLoading) {
    return <Loading />;
  } else {
    return <Redirect href="/auth/login" />;
  }
}
