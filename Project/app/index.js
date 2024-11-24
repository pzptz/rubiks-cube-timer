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
  const fetchMessage = async () => {
    console.log("foo");
    try {
      //Change index to fetch a different message
      let temp = (await db.from("test").select()).data[1].message;
      console.log(temp);
      setMessage(temp);
    } catch (error) {
      console.log("too");
      console.log(err);
    }
  };
  useEffect(() => {
    fetchMessage();
    // signOut();
  }, []);
  if (session) {
    return (
      <SafeAreaView>
        <Text>{message}</Text>
      </SafeAreaView>
    );
  } else if (isLoading) {
    return <Loading />;
  } else {
    return <Login />;
  }
}
