import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../components/styles";
import {
  Hero,
  HolidayState,
  Timeline,
  WeekStrip,
  type HeroData,
} from "../components/ui";
import { useSchedule } from "../context/ScheduleContext";
import {
  DAY_FULL,
  HOLIDAYS,
  MONTHS,
  findNextClassDay,
  fmtTime,
  getClasses,
} from "../libs/schedule";

export default function TodayScreen() {
  const router = useRouter();
  const { now, nowMin, todayIdx, dates, selected, setSelected, openDetail } =
    useSchedule();

  const isToday = selected === todayIdx;
  const classes = useMemo(() => getClasses(selected), [selected]);
  const isHoliday = HOLIDAYS.includes(selected) || classes.length === 0;
  const selDate = dates[selected];
  const nextDay = findNextClassDay(now);

  // current and upcoming class (today only)
  const { current, next } = useMemo(() => {
    if (!isToday) return { current: null, next: null };
    return {
      current: classes.find((c) => c.start <= nowMin && nowMin < c.end) || null,
      next: classes.find((c) => c.start > nowMin) || null,
    };
  }, [isToday, classes, nowMin]);

  let hero: HeroData | null = null;
  if (isToday && !isHoliday) {
    if (current) hero = { kind: "now", item: current, after: next, nowMin };
    else if (next) hero = { kind: "next", item: next, nowMin };
    else hero = { kind: "done", nextDay };
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.h1}>
              {isToday ? "Today" : DAY_FULL[selected]}
            </Text>
            <Text style={styles.subtitle}>
              {DAY_FULL[selected]}, {selDate.getDate()}{" "}
              {MONTHS[selDate.getMonth()]} {selDate.getFullYear()}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.clockBox}>
              <Text style={styles.clockText}>{fmtTime(nowMin)}</Text>
              <Text style={styles.clockSub}>
                {isHoliday ? "Holiday" : `${classes.length} classes`}
              </Text>
            </View>
          </View>
        </View>

        <WeekStrip
          dates={dates}
          today={todayIdx}
          selected={selected}
          onSelect={setSelected}
        />

        {hero && <Hero hero={hero} onPressClass={(c) => openDetail(c)} />}

        {isHoliday ? (
          <HolidayState dayIdx={selected} isToday={isToday} nextDay={nextDay} />
        ) : (
          <Timeline
            classes={classes}
            nowMin={isToday ? nowMin : null}
            currentId={current ? current.id : null}
            nextId={next ? next.id : null}
            onPressClass={(c) => openDetail(c)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
