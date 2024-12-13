import React, { useEffect, useRef, useState } from "react";
import { generateScrambleSync } from "@/utils/scrambled";
import useSession from "@/utils/useSession";
import db from "@/database/db";
import { Link } from "expo-router";
import { useContext } from "react";
import {
  averagesContext,
  runningContext,
  settings,
  loadingContext,
} from "@/assets/contexts";
import Loading from "@/components/Loading";
import Theme from "@/assets/theme";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";

export default function Main() {
  const themeChoice = useContext(settings).themeChoice;
  const session = useSession();
  const [endTime, setEndTime] = useState(0); // Time in milliseconds
  const [startTime, setStartTime] = useState(0);
  const [scramble, setScramble] = useState(null);
  const cubeType = useContext(settings).cubeType;
  const intervalRef = useRef(null); // Ref to store the interval ID
  const averages = useContext(averagesContext).averages;
  const useInspectionTime = useContext(settings).inspectionTime;
  const runningState = useContext(runningContext);
  const loading = useContext(loadingContext).loading;
  const setLoading = useContext(loadingContext).setLoading;
  const startCountdown = () => {
    if (runningState.isRunning !== 1) {
      runningState.setIsRunning(1);

      const start = Date.now(); // Start of the countdown
      const end = start + 14950; // Inspection time duration (3950 ms for ~4 seconds)

      setStartTime(start);
      setEndTime(end);

      intervalRef.current = setInterval(() => {
        const currentTime = Date.now();
        const remainingTime = end - currentTime;

        if (remainingTime <= 0) {
          // Reset runningState and clear the interval when countdown ends
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          runningState.setIsRunning(0);
          const newTime = {
            scramble: scramble,
            time: -1,
            user_id: session.user.id,
            penalty: 2,
            time_with_penalty: -1,
            cube_type: cubeType,
          };
          console.log("Ran out of inspection time, DNF");
          pushToDB(newTime);
          setStartTime(currentTime);
          setEndTime(currentTime - 1);
        } else {
          setStartTime(currentTime); // Update the timer
        }
      }, 100); // Update every 100ms
    }
  };

  // Start the stopwatch
  const startStopwatch = () => {
    if (runningState.isRunning != 2) {
      clearInterval(intervalRef.current);
      runningState.setIsRunning(2);
      const start = Date.now(); // Adjust for any paused time
      setStartTime(start);
      setEndTime(start);
      intervalRef.current = setInterval(() => {
        setEndTime(Date.now());
      }, 100); // Update every 100 milliseconds
    } else {
      console.log("flag");
    }
  };

  // Stop the stopwatch
  const stopStopwatch = () => {
    let end = Date.now();

    if (runningState.isRunning == 2) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      let time = end - startTime;
      const newTime = {
        scramble: scramble,
        time: time,
        user_id: session.user.id,
        time_with_penalty: time,
        penalty: 0,
        cube_type: cubeType,
      };
      // console.log(
      //   "currently not pushing db go to end of stopStopwatch in main.js"
      // );

      pushToDB(newTime);
    }
    setEndTime(end);
    generateScramble();
  };
  const pushToDB = async (newTime) => {
    setLoading(true);
    if (session) {
      try {
        const { data, error } = await db.from("solve_times").insert(newTime);
        if (error) throw error;
        console.log(`Successfully pushed ${newTime.time} to db`);
        setLoading(false);
        runningState.setIsRunning(0);
      } catch (err) {
        console.log(err);
        setTimeout(() => pushToDB(newTime), 500); // Retry after a short time
      }
    }
  };
  const generateScramble = async () => {
    setScramble(generateScrambleSync(21, cubeType).scramble);
  };
  // Cleanup on unmount
  useEffect(() => {
    generateScramble();
    return () => clearInterval(intervalRef.current);
  }, [cubeType]);

  // Format time into minutes, seconds, and milliseconds (mm:ss:ms)
  const formatTime = (time) => {
    if (time == null || time == undefined) {
      return "--:---";
    }
    if (time < 0) {
      return "DNF";
    }
    const mins = Math.floor(time / 60000); // 1 minute = 60000ms
    const secs = Math.floor((time % 60000) / 1000); // 1 second = 1000ms
    if (runningState.isRunning == 2) {
      const millis = Math.floor((time % 1000) / 100); // Show one decimal place for milliseconds
      if (mins == 0) {
        return `${String(secs).padStart(1, "0")}.${String(millis)}`;
      } else {
        return `${String(mins)}:${String(secs).padStart(1, "0")}.${String(
          millis
        )}`;
      }
    } else if (runningState.isRunning == 1) {
      return `${String(secs + 1)}`;
    } else if (runningState.isRunning == 0) {
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
    return 0;
  };
  if (!averages || loading) {
    return <Loading themeChoice={themeChoice} />;
  }
  if (runningState.isRunning == 2) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: Theme[themeChoice].backgroundPrimary },
        ]}
      >
        <TouchableOpacity style={styles.button} onPressIn={stopStopwatch}>
          <View style={styles.timerBox}>
            <Text
              style={[styles.timer, { color: Theme[themeChoice].textPrimary }]}
            >
              {formatTime(endTime - startTime)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  } else if (runningState.isRunning == 1) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: Theme[themeChoice].backgroundPrimary },
        ]}
      >
        <TouchableOpacity style={styles.button} onPressOut={startStopwatch}>
          <View style={styles.timerBox}>
            <Text
              style={[styles.timer, { color: Theme[themeChoice].textPrimary }]}
            >
              {formatTime(endTime - startTime)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: Theme[themeChoice].backgroundPrimary },
        ]}
      >
        <View style={styles.statsBox}>
          <Text
            style={[styles.stats, { color: Theme[themeChoice].textSecondary }]}
          >
            ao5: {formatTime(averages.ao5)}
          </Text>
          <Text
            style={[styles.stats, { color: Theme[themeChoice].textSecondary }]}
          >
            ao12: {formatTime(averages.ao12)}
          </Text>
        </View>
        <View style={styles.timerBox}>
          <Text
            style={[styles.timer, { color: Theme[themeChoice].textPrimary }]}
          >
            {formatTime(endTime - startTime)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={useInspectionTime ? startCountdown : startStopwatch}
        />
        <View style={styles.subButtonsBox}>
          <View style={{ flex: 1, alignItems: "center", padding: 16 }}>
            <Link href="/(tabs)/timer/instructions">
              <View
                style={[
                  styles.newScrambleButton,
                  { backgroundColor: Theme[themeChoice].flair },
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: Theme[themeChoice].textPrimary },
                  ]}
                >
                  How to use
                </Text>
              </View>
            </Link>
          </View>
          <View style={{ flex: 1, alignItems: "center", padding: 16 }}>
            <TouchableHighlight
              style={[
                styles.newScrambleButton,
                { backgroundColor: Theme[themeChoice].flair },
              ]}
              onPress={() => generateScramble()}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: Theme[themeChoice].textPrimary },
                ]}
              >
                New Scramble
              </Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.scrambleBox}>
          <Text
            style={[styles.scramble, { color: Theme[themeChoice].textPrimary }]}
          >
            {scramble}
          </Text>
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
    fontSize: Theme.text.textXXL,
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
    fontSize: Theme.text.textXL,
    fontWeight: "bold",
    textAlign: "center",
  },
  statsBox: {
    position: "absolute",
    top: 450,
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-between",
  },
  scrambleBox: { width: "100%" },
  scramble: {
    fontSize: Theme.text.textXL,
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
    justifyContent: "space-around",
  },
  newScrambleButton: {
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "100%",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: Theme.text.textLarge,
  },
});
