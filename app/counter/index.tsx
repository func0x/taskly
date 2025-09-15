import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { TimeSegment } from "../../components/TimeSegment";
import { intervalToDuration, isBefore } from "date-fns";
import { getFromStorage, setToStorage } from "../../utils/storage";

// 10 seconds from now
const frequency = 10 * 1000;

const countdownStorageKey = "taskly-countdown";

type PersistedCountdownState = {
  currentNotificationId?: string;
  completedAtTimestamps: number[];
};

type CountdownStatus = {
  isOverdue: boolean;
  distance: ReturnType<typeof intervalToDuration>;
};

export default function CounterScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();
  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });

  const lastCompletedTimestamp = countdownState?.completedAtTimestamps[0];

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    };
    init();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timestamp = lastCompletedTimestamp
        ? lastCompletedTimestamp + frequency
        : Date.now();
      if (lastCompletedTimestamp) {
        setIsLoading(false);
      }
      const isOverdue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { start: timestamp, end: Date.now() }
          : { start: Date.now(), end: timestamp },
      );
      setStatus({ isOverdue, distance });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [lastCompletedTimestamp]);

  const scheduleNotification = async () => {
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "The thins is due!",
        },
        trigger: {
          seconds: frequency / 1000,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });
    } else {
      if (Device.isDevice) {
        Alert.alert(
          "Unable to schedule notification!",
          "Enable the notification permission for Expo Go in settings.",
        );
      }
    }

    if (countdownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        countdownState.currentNotificationId,
      );
    }

    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countdownState
        ? [Date.now(), ...countdownState.completedAtTimestamps]
        : [Date.now()],
    };
    setCountdownState(newCountdownState);
    await setToStorage(countdownStorageKey, newCountdownState);
  };

  if (isLoading) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        status.isOverdue ? styles.containerLate : undefined,
      ]}
    >
      {status.isOverdue ? (
        <Text style={[styles.heading, styles.whiteText]}>Thing ovedue by</Text>
      ) : (
        <Text style={styles.heading}>Thing due in...</Text>
      )}
      <View style={styles.row}>
        <TimeSegment
          number={status.distance.days ?? 0}
          unit="Days"
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          number={status.distance.hours ?? 0}
          unit="Hours"
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          number={status.distance.minutes ?? 0}
          unit="Minutes"
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          number={status.distance.seconds ?? 0}
          unit="Seconds"
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>I&apos;ve done the thing!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: theme.colorWhite,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: theme.colorWhite,
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  whiteText: {
    color: theme.colorWhite,
  },
});
