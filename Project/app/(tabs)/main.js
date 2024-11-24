import { useEffect, useState } from "react";
import { View, Text, Alert, SafeAreaView } from "react-native";
import db from "@/database/db";
export default function Main() {
  const [message, setMessage] = useState(null);
  const fetchMessage = async () => {
    try {
      //Change index to fetch a different message
      let temp = (await db.from("test").select()).data[0].message;
      setMessage(temp);
    } catch (error) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchMessage();
  }, []);
  return <View>{/* <Text>{message}</Text> */}</View>;
}
