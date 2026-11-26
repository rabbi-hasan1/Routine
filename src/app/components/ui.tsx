import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { C } from "../constants/theme";
import {
  DAY_FULL,
  DAY_SHORT,
  HOLIDAYS,
  MIN_GAP_TO_SHOW,
  MONTHS,
  PROFILE,
  dayLabelFor,
  fmtDuration,
  fmtTime,
  getClasses,
  type ClassItem,
  type NextClassDay,
} from "../libs/schedule";
import { styles } from "./styles";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type HeroData =
  | { kind: "now"; item: ClassItem; after: ClassItem | null; nowMin: number }
  | { kind: "next"; item: ClassItem; nowMin: number }
  | { kind: "done"; nextDay: NextClassDay | null };

/* =====================================================
   Components
   ===================================================== */
export function WeekStrip({
  dates,
  today,
  selected,
  onSelect,
}: {
  dates: Date[];
  today: number;
  selected: number;
  onSelect: (dayIdx: number) => void;
}) {
  return (
    <View style={styles.weekRow}>
      {dates.map((d, i) => {
        const active = i === selected;
        const off = HOLIDAYS.includes(i);
        const isToday = i === today;
        return (
          <Pressable
            key={i}
            onPress={() => onSelect(i)}
            style={[
              styles.dayPill,
              off && styles.dayPillOff,
              isToday && !active && styles.dayPillToday,
              active && styles.dayPillActive,
            ]}
          >
            <Text style={[styles.dayLabel, active && { color: "#B9BEDD" }]}>
              {DAY_SHORT[i]}
            </Text>
            <Text
              style={[
                styles.dayDate,
                off && { color: C.faint },
                active && { color: C.white },
              ]}
            >
              {d.getDate()}
            </Text>
            <View
              style={[
                styles.dayDot,
                {
                  backgroundColor: off
                    ? "transparent"
                    : active
                      ? "#FFEBB0"
                      : C.primary,
                },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export function Hero({
  hero,
  onPressClass,
}: {
  hero: HeroData;
  onPressClass: (c: ClassItem) => void;
}) {
  if (hero.kind === "done") {
    return (
      <View style={[styles.hero, { backgroundColor: C.ink }]}>
        <Text style={styles.heroKicker}>All done for today</Text>
        <Text style={styles.heroTitle}>No more classes</Text>
        {hero.nextDay && (
          <Text style={[styles.heroMeta, { marginTop: 10 }]}>
            {dayLabelFor(hero.nextDay.offset, hero.nextDay.dayIdx)}, first class
            at {fmtTime(hero.nextDay.first.start)}: {hero.nextDay.first.title}
          </Text>
        )}
      </View>
    );
  }
  const c = hero.item;
  const kicker =
    hero.kind === "now"
      ? `In progress, ends in ${fmtDuration(c.end - hero.nowMin)}`
      : `Next up, in ${fmtDuration(c.start - hero.nowMin)}`;
  return (
    <View style={styles.hero}>
      <Text style={styles.heroKicker}>{kicker}</Text>
      <Text style={styles.heroTitle}>{c.title}</Text>
      <View style={styles.heroBottom}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroMeta}>
            {fmtTime(c.start)} to {fmtTime(c.end)} in {c.room}
          </Text>
          <Text style={styles.heroMeta}>{c.teacher}</Text>
          {hero.kind === "now" && hero.after && (
            <Text
              style={[styles.heroMeta, { marginTop: 6, color: C.primaryText }]}
            >
              Then {hero.after.title} at {fmtTime(hero.after.start)}
            </Text>
          )}
        </View>
        <Pressable style={styles.heroBtn} onPress={() => onPressClass(c)}>
          <Text style={styles.heroBtnText}>Details</Text>
        </Pressable>
      </View>
    </View>
  );
}

type TimelineRow =
  | { kind: "class"; c: ClassItem }
  | { kind: "free"; from: number; to: number; active: boolean }
  | { kind: "break"; until: number };

export function Timeline({
  classes,
  nowMin,
  currentId,
  nextId,
  onPressClass,
}: {
  classes: ClassItem[];
  nowMin: number | null;
  currentId: string | null;
  nextId: string | null;
  onPressClass: (c: ClassItem) => void;
}) {
  // Build the list: classes, free periods (long gaps) and a "break" marker
  // when the current time falls in a short gap between two classes.
  const rows: TimelineRow[] = [];
  classes.forEach((c, i) => {
    rows.push({ kind: "class", c });
    const following = classes[i + 1];
    if (!following) return;
    const gap = following.start - c.end;
    const inGap =
      nowMin !== null && nowMin >= c.end && nowMin < following.start;
    if (gap >= MIN_GAP_TO_SHOW) {
      rows.push({
        kind: "free",
        from: c.end,
        to: following.start,
        active: inGap,
      });
    } else if (inGap) {
      rows.push({ kind: "break", until: following.start });
    }
  });

  return (
    <View style={{ marginTop: 4 }}>
      {rows.map((row, i) => {
        const first = i === 0;
        const last = i === rows.length - 1;
        const isClass = row.kind === "class";

        const dotSize = isClass ? 12 : 10;
        const dotTop = isClass ? 18 : 8;
        const center = dotTop + dotSize / 2;

        const past =
          row.kind === "class" && nowMin !== null && row.c.end <= nowMin;
        const current = row.kind === "class" && row.c.id === currentId;
        const upcomingNext = row.kind === "class" && row.c.id === nextId;
        const redDot =
          current ||
          row.kind === "break" ||
          (row.kind === "free" && row.active);

        let dotFill: string = C.white;
        let dotBorder: string = "#B9BEDD";
        if (row.kind === "class") {
          dotBorder = row.c.bar;
          if (past) {
            dotFill = C.faint;
            dotBorder = C.faint;
          }
        }
        if (redDot) {
          dotFill = C.now;
          dotBorder = C.now;
        }

        const rail = (
          <View style={styles.tlRail}>
            {!(first && last) && (
              <View
                style={[
                  styles.tlLine,
                  first
                    ? { top: center, bottom: 0 }
                    : last
                      ? { top: 0, height: center }
                      : { top: 0, bottom: 0 },
                ]}
              />
            )}
            {(current || row.kind === "break") && (
              <View style={[styles.tlRing, { top: center - 11 }]} />
            )}
            <View
              style={[
                styles.tlDot,
                {
                  top: dotTop,
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: dotFill,
                  borderColor: dotBorder,
                },
              ]}
            />
          </View>
        );

        if (row.kind === "class") {
          const c = row.c;
          const tag = current
            ? { label: "Now", color: C.now }
            : upcomingNext
              ? { label: "Next", color: C.primary }
              : past
                ? { label: "Done", color: C.faint }
                : null;
          const pct =
            current && nowMin !== null
              ? Math.min(1, Math.max(0, (nowMin - c.start) / (c.end - c.start)))
              : 0;

          return (
            <View key={c.id} style={styles.tlRow}>
              <View style={styles.tlTimes}>
                <Text style={[styles.tlStart, past && { color: C.faint }]}>
                  {fmtTime(c.start)}
                </Text>
                <Text style={styles.tlEnd}>{fmtTime(c.end)}</Text>
              </View>
              {rail}
              <Pressable
                onPress={() => onPressClass(c)}
                style={[
                  styles.tlCard,
                  { backgroundColor: c.bg, opacity: past ? 0.55 : 1 },
                ]}
              >
                <View style={[styles.tlCardBar, { backgroundColor: c.bar }]} />
                <View style={styles.tlCardBody}>
                  <View style={styles.tlCardTop}>
                    <Text style={styles.tlTitle} numberOfLines={2}>
                      {c.title}
                    </Text>
                    {tag && (
                      <View
                        style={[styles.tlTag, { backgroundColor: tag.color }]}
                      >
                        <Text style={styles.tlTagText}>{tag.label}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.tlMeta}>
                    <Ionicons name="location-outline" size={14} color={c.sub} />
                    <Text
                      style={[styles.tlMetaText, { color: c.sub }]}
                      numberOfLines={1}
                    >
                      {c.room}
                    </Text>
                  </View>
                  <View style={styles.tlMeta}>
                    <Ionicons name="person-outline" size={14} color={c.sub} />
                    <Text
                      style={[styles.tlMetaText, { color: c.sub }]}
                      numberOfLines={1}
                    >
                      {c.teacher}
                    </Text>
                  </View>
                  {current && nowMin !== null && (
                    <View style={{ marginTop: 4 }}>
                      <View style={styles.tlProgressTrack}>
                        <View
                          style={[
                            styles.tlProgressFill,
                            {
                              width:
                                `${Math.round(pct * 100)}%` as `${number}%`,
                              backgroundColor: c.bar,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.tlProgressText, { color: c.sub }]}>
                        {fmtDuration(c.end - nowMin)} left
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            </View>
          );
        }

        if (row.kind === "free") {
          return (
            <View key={`free-${row.from}`} style={styles.tlRow}>
              <View style={[styles.tlTimes, { paddingTop: 4 }]} />
              {rail}
              <View style={styles.tlFree}>
                <Text
                  style={[styles.tlFreeTitle, row.active && { color: C.now }]}
                >
                  {row.active ? "Now: " : ""}Free period,{" "}
                  {fmtDuration(row.to - row.from)}
                </Text>
                <Text style={styles.tlFreeSub}>
                  {fmtTime(row.from)} to {fmtTime(row.to)}
                </Text>
              </View>
            </View>
          );
        }

        return (
          <View key="break" style={styles.tlRow}>
            <View style={[styles.tlTimes, { paddingTop: 4 }]}>
              <Text style={[styles.tlStart, { color: C.now }]}>
                {nowMin !== null ? fmtTime(nowMin) : ""}
              </Text>
            </View>
            {rail}
            <View style={styles.tlFree}>
              <Text style={[styles.tlFreeTitle, { color: C.now }]}>
                Break, next class at {fmtTime(row.until)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function HolidayState({
  dayIdx,
  isToday,
  nextDay,
}: {
  dayIdx: number;
  isToday: boolean;
  nextDay: NextClassDay | null;
}) {
  return (
    <View style={styles.empty}>
      <Ionicons name="sunny-outline" size={30} color={C.faint} />
      <Text style={styles.emptyTitle}>Holiday</Text>
      <Text style={styles.emptySub}>No classes on {DAY_FULL[dayIdx]}.</Text>
      {isToday && nextDay && (
        <Text style={[styles.emptySub, { marginTop: 14, textAlign: "center" }]}>
          Next class: {DAY_FULL[nextDay.dayIdx]} at{" "}
          {fmtTime(nextDay.first.start)},{"\n"}
          {nextDay.first.title}
        </Text>
      )}
    </View>
  );
}

export function DetailSheet({
  item,
  dateText,
  status,
  onClose,
}: {
  item: ClassItem | null;
  dateText: string;
  status: string;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={!!item}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          {item && (
            <>
              <View style={styles.sheetGrab} />
              <View style={[styles.sheetAccent, { backgroundColor: item.bg }]}>
                <View
                  style={[styles.sheetAccentBar, { backgroundColor: item.bar }]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetTitle}>{item.title}</Text>
                  <Text style={[styles.sheetSub, { color: item.sub }]}>
                    {item.titleBn}
                  </Text>
                  <Text style={[styles.sheetSub, { color: item.sub }]}>
                    {dateText}
                  </Text>
                </View>
                {!!status && (
                  <View style={styles.statusPill}>
                    <Text style={styles.statusText}>{status}</Text>
                  </View>
                )}
              </View>
              <Row
                icon="time-outline"
                label="Time"
                value={`${fmtTime(item.start)} to ${fmtTime(item.end)}`}
              />
              <Row
                icon="hourglass-outline"
                label="Duration"
                value={fmtDuration(item.end - item.start)}
              />
              <Row icon="location-outline" label="Room" value={item.room} />
              <Row
                icon="layers-outline"
                label="Period"
                value={
                  item.periodFrom === item.periodTo
                    ? `${item.periodFrom}`
                    : `${item.periodFrom} to ${item.periodTo}`
                }
              />
              <Row icon="person-outline" label="Teacher" value={item.teacher} />
              <Pressable style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeBtnText}>Close</Text>
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function Row({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={20} color={C.faint} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function WeekView({
  dates,
  today,
  onOpenDay,
  onPressClass,
  onBack,
}: {
  dates: Date[];
  today: number;
  onOpenDay: (dayIdx: number) => void;
  onPressClass: (c: ClassItem, dayIdx: number) => void;
  onBack?: () => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onBack && (
            <Pressable
              style={styles.iconBtn}
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Back to today"
            >
              <Ionicons name="chevron-back" size={20} color={C.ink} />
            </Pressable>
          )}
          <View>
            <Text style={styles.h1}>This week</Text>
            <Text style={styles.subtitle}>
              {dates[0].getDate()} {MONTHS[dates[0].getMonth()]} to{" "}
              {dates[6].getDate()} {MONTHS[dates[6].getMonth()]}
            </Text>
            <Text style={styles.subtitle}>
              {PROFILE.departmentShort}, {PROFILE.semester} ({PROFILE.session})
            </Text>
          </View>
        </View>
      </View>

      {dates.map((d, i) => {
        const list = getClasses(i);
        const off = list.length === 0;
        return (
          <View key={i} style={styles.weekCard}>
            <Pressable style={styles.weekCardHead} onPress={() => onOpenDay(i)}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.weekDay, off && { color: C.faint }]}>
                  {DAY_FULL[i]}
                  {i === today ? "  (today)" : ""}
                </Text>
                <Text style={styles.weekDate}>
                  {d.getDate()} {MONTHS[d.getMonth()]}
                </Text>
              </View>
              <Text style={styles.weekCount}>
                {off ? "Holiday" : `${list.length} classes`}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={C.faint} />
            </Pressable>
            {!off &&
              list.map((c) => (
                <Pressable
                  key={c.id}
                  style={styles.weekItem}
                  onPress={() => onPressClass(c, i)}
                >
                  <View
                    style={[styles.weekItemBar, { backgroundColor: c.bar }]}
                  />
                  <Text style={styles.weekItemTime}>{fmtTime(c.start)}</Text>
                  <Text style={styles.weekItemTitle} numberOfLines={2}>
                    {c.title}
                  </Text>
                  <Text style={styles.weekItemRoom} numberOfLines={1}>
                    {c.room}
                  </Text>
                </Pressable>
              ))}
          </View>
        );
      })}
    </ScrollView>
  );
}
