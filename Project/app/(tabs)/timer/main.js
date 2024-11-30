import React, { useEffect, useRef, useState } from "react";
import { generateScrambleSync } from "@/utils/scrambled";
import useSession from "@/utils/useSession";
import db from "@/database/db";
import { Link } from "expo-router";
import { useContext } from "react";
import { averagesContext, runningContext } from "@/assets/contexts";
import Loading from "@/components/Loading";

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
  const [startTime, setStartTime] = useState(0);
  const [scramble, setScramble] = useState(null);
  const intervalRef = useRef(null); // Ref to store the interval ID
  const averages = useContext(averagesContext).averages;

  const runningState = useContext(runningContext);
  // Start the stopwatch
  const startStopwatch = () => {
    if (!runningState.isRunning) {
      runningState.setIsRunning(true);
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
    let end = Date.now();
    if (runningState.isRunning) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      let time = end - startTime;
      const newTime = {
        scramble: scramble,
        time: time,
        user_id: session.user.id,
      };
      console.log(
        "currently not pushing db go to end of stopStopwatch in main.js"
      );
      //pushToDB(newTime);
    }
    setEndTime(end);
    generateScramble();
  };
  const pushToDB = async (newTime) => {
    if (session) {
      try {
        const { data, error } = await db.from("solve_times").insert(newTime);
        if (error) throw error;
        console.log("success");
      } catch (err) {
        console.log("failed, retrying");
        setTimeout(() => pushToDB(newTime), 500); // Retry after a short time
      }
    }
  };
  const generateScramble = async () => {
    setScramble(generateScrambleSync(21, 3).scramble);
  };
  // Cleanup on unmount
  useEffect(() => {
    generateScramble();
    return () => clearInterval(intervalRef.current);
  }, []);

  // Format time into minutes, seconds, and milliseconds (mm:ss:ms)
  const formatTime = (time) => {
    if (runningState.isRunning) {
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
  if (averages.ao5 == -1) {
    return <Loading />;
  }
  if (runningState.isRunning) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={stopStopwatch}
          onPressOut={() => runningState.setIsRunning(false)}
        >
          <View style={styles.timerBox}>
            <Text style={styles.timer}>{formatTime(endTime - startTime)}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.statsBox}>
          <Text style={styles.stats}>ao5: {formatTime(averages.ao5)}</Text>
          <Text style={styles.stats}>ao12: {formatTime(averages.ao12)}</Text>
        </View>
        <View style={styles.timerBox}>
          <Text style={styles.timer}>{formatTime(endTime - startTime)}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={startStopwatch}
        ></TouchableOpacity>

        <View style={styles.scrambleBox}>
          <Text style={styles.scramble}>{scramble}</Text>
        </View>
        <View style={styles.subButtonsBox}>
          <Link
            href="/(tabs)/timer/instructions"
            style={styles.instructionsButtonLink}
          >
            <View style={styles.instructionsButton}>
              <Text style={styles.scramble}>How to use</Text>
            </View>
          </Link>

          <TouchableHighlight
            style={styles.newScrambleButton}
            onPress={() => generateScramble()}
          >
            <Text style={styles.scramble}>New Scramble</Text>
          </TouchableHighlight>
        </View>
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
    textAlign: "center",
    position: "absolute",
    top: 350,
  },

  timerBox: {
    width: "100%",
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
  },
  stats: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  statsBox: {
    position: "absolute",
    top: 450,
    flexDirection: "row",
    width: "70%",
    justifyContent: "space-between",
  },
  scrambleBox: { width: "100%", borderBottomWidth: 3 },
  scramble: {
    fontSize: 24,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
    textAlign: "center",
    padding: 12,
  },
  button: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  subButtonsBox: {
    width: "100%",
    flexDirection: "row",
  },
  newScrambleButton: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderLeftWidth: 1,
    borderBottomWidth: 3,
  },
  instructionsButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  instructionsButtonLink: {
    width: "50%",
    borderRightWidth: 1,
    borderBottomWidth: 3,
    paddingVertical: 12,
  },
});
