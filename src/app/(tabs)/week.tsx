import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../components/styles";
import { WeekView } from "../components/ui";
import { useSchedule } from "../context/ScheduleContext";

export default function WeekScreen() {
  const router = useRouter();
  const { dates, todayIdx, setSelected, openDetail } = useSchedule();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <WeekView
        dates={dates}
        today={todayIdx}
        onOpenDay={(i) => {
          setSelected(i);
          router.back();
        }}
        onPressClass={(c, i) => openDetail(c, i)}
        onBack={() => router.back()}
      />
    </SafeAreaView>
  );
}
