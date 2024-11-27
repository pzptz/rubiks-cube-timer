import React, { useEffect, useRef, useState } from "react";
const cubeScrambler = require("cube-scrambler")();
import useSession from "@/utils/useSession";
import db from "@/database/db";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";

export default function Main() {
  const session = useSession();
  const [endTime, setEndTime] = useState(0); // Time in milliseconds
  const [isRunning, setIsRunning] = useState(false); // Toggle for start/stop
  const [startTime, setStartTime] = useState(0);
  const [scramble, setScramble] = useState(null);
  const intervalRef = useRef(null); // Ref to store the interval ID

  // Start the stopwatch
  const startStopwatch = () => {
    if (!isRunning) {
      setIsRunning(true);
      const start = Date.now(); // Adjust for any paused time
      setStartTime(start);
      setEndTime(start);
      intervalRef.current = setInterval(() => {
        setEndTime(Date.now());
      }, 100); // Update every 10 milliseconds
    }
  };

  // Stop the stopwatch
  const stopStopwatch = () => {
    if (isRunning) {
      end = Date.now();
      setEndTime(end);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      time = end - startTime;
      pushToDB(time, scramble);
    }
    generateScramble();
  };
  // Test for commit's sake
  const pushToDB = async (time, scrambleText) => {
    if (session) {
      try {
        const newTime = {
          scramble: scrambleText,
          time: time,
          user_id: session.user.id,
        };
        await db.from("solve_times").insert(newTime);
      } catch (err) {
        console.error(err);
      }
    }
  };
  const generateScramble = async () => {
    setScramble(cubeScrambler.scramble().join(" "));
  };
  // Cleanup on unmount
  useEffect(() => {
    generateScramble();
    return () => clearInterval(intervalRef.current);
  }, []);

  // Format time into minutes, seconds, and milliseconds (mm:ss:ms)
  const formatTime = () => {
    let time = endTime - startTime;
    if (isRunning) {
      const mins = Math.floor(time / 60000); // 1 minute = 60000ms
      const secs = Math.floor((time % 60000) / 1000); // 1 second = 1000ms
      const millis = Math.floor((time % 1000) / 100); // Show one decimal place for milliseconds
      if (mins == 0) {
        return `${String(secs).padStart(1, "0")}.${String(millis)}`;
      } else {
        return `${String(mins)}:${String(secs).padStart(1, "0")}.${String(
          millis
        )}`;
      }
    } else {
      const mins = Math.floor(time / 60000); // 1 minute = 60000ms
      const secs = Math.floor((time % 60000) / 1000); // 1 second = 1000ms
      const millis = Math.floor(time % 1000); // Show two decimal places for milliseconds
      if (mins == 0) {
        return `${String(secs).padStart(1, "0")}.${String(millis).padStart(
          3,
          "0"
        )}`;
      } else {
        return `${String(mins)}:${String(secs).padStart(1, "0")}.${String(
          millis
        ).padStart(3, "0")}`;
      }
    }
  };

  if (isRunning) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={stopStopwatch}
          onPressOut={() => setIsRunning(false)}
        >
          <View>
            <Text style={styles.timer}>{formatTime()}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={startStopwatch}>
          <View>
            <Text style={styles.timer}>{formatTime()}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.scramble}>{scramble}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column-reverse",
    alignItems: "center",
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
    marginBottom: 20,
    textAlign: "center",
  },
  scramble: {
    fontSize: 24,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
  button: {
    width: "100%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
});
