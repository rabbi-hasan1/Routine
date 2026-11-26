import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AppState } from "react-native";
import { DetailSheet } from "../components/ui";
import { DAY_FULL, MONTHS, minutesOfDay, type ClassItem } from "../libs/schedule";

/* =====================================================
   Live clock
   ===================================================== */
export function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 15000);
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") tick();
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, []);
  return now;
}

/* =====================================================
   Shared state (selected day, class details, live clock)
   ===================================================== */
type Detail = { item: ClassItem; dayIdx: number } | null;

export type ScheduleValue = {
  now: Date;
  nowMin: number;
  todayIdx: number;
  dates: Date[];
  selected: number;
  setSelected: (dayIdx: number) => void;
  openDetail: (item: ClassItem, dayIdx?: number) => void;
};

const ScheduleContext = createContext<ScheduleValue | null>(null);

export function useSchedule(): ScheduleValue {
  const value = useContext(ScheduleContext);
  if (!value) throw new Error("useSchedule must be used inside <ScheduleProvider>");
  return value;
}

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const now = useNow();
  const nowMin = minutesOfDay(now);
  const todayIdx = now.getDay();

  const [selected, setSelected] = useState(todayIdx);
  const [detail, setDetail] = useState<Detail>(null);

  // dates of the current week, Sunday first
  const dates = useMemo(() => {
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate() - now.getDay();
    return Array.from({ length: 7 }, (_, i) => new Date(y, m, d + i));
    // recompute only when the calendar day changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now.getFullYear(), now.getMonth(), now.getDate()]);

  const openDetail = (item: ClassItem, dayIdx: number = selected) => setDetail({ item, dayIdx });

  const statusFor = (c: ClassItem, dayIdx: number): string => {
    if (dayIdx !== todayIdx) return "";
    if (c.end <= nowMin) return "Finished";
    if (c.start <= nowMin) return "In progress";
    return "Upcoming";
  };

  const detailDate = detail
    ? `${DAY_FULL[detail.dayIdx]}, ${dates[detail.dayIdx].getDate()} ${
        MONTHS[dates[detail.dayIdx].getMonth()]
      }`
    : "";

  const value: ScheduleValue = { now, nowMin, todayIdx, dates, selected, setSelected, openDetail };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
      <DetailSheet
        item={detail ? detail.item : null}
        dateText={detailDate}
        status={detail ? statusFor(detail.item, detail.dayIdx) : ""}
        onClose={() => setDetail(null)}
      />
    </ScheduleContext.Provider>
  );
}
