/* =====================================================
   Routine data
   Naogaon Polytechnic Institute, Naogaon
   Department of Computer Science and Technology (CST)
   6th Semester, Session 2023-2024 (1st and 2nd shift)

   Week: Sunday to Thursday are class days.
   Friday (5) and Saturday (6) are holidays.
   Class hours: 8:30 AM to 12:35 PM, 7 periods of 35 minutes, no breaks.
   ===================================================== */
export type Subject = {
  title: string;
  titleBn: string;
  teacher: string; // teacher initials, as written in the routine
  bg: string;
  bar: string;
  sub: string;
};

export type ClassItem = Subject & {
  id: string;
  room: string;
  start: number; // minutes from midnight
  end: number; // minutes from midnight
  periodFrom: number; // 1 to 7
  periodTo: number; // 1 to 7
};

export type NextClassDay = {
  offset: number;
  dayIdx: number;
  first: ClassItem;
};

type ScheduleEntry = {
  from: number; // first period (1 to 7)
  to: number; // last period (1 to 7), inclusive
  subject: string;
  room: string;
};

export const PROFILE = {
  institute: "Naogaon Polytechnic Institute",
  department: "Computer Science and Technology (CST)",
  departmentShort: "CST",
  semester: "6th Semester",
  session: "2023-2024",
};

export const DAY_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const HOLIDAYS = [5, 6];

// Period 1 to 7 (index 0 to 6), 35 minutes each
export const PERIODS = [
  { start: 8 * 60 + 30, end: 9 * 60 + 5 },
  { start: 9 * 60 + 5, end: 9 * 60 + 40 },
  { start: 9 * 60 + 40, end: 10 * 60 + 15 },
  { start: 10 * 60 + 15, end: 10 * 60 + 50 },
  { start: 10 * 60 + 50, end: 11 * 60 + 25 },
  { start: 11 * 60 + 25, end: 12 * 60 },
  { start: 12 * 60, end: 12 * 60 + 35 },
];

export const SUBJECTS: Record<string, Subject> = {
  web: {
    title: "Web Development Project",
    titleBn: "ওয়েব ডেভেলপমেন্ট প্রজেক্ট",
    teacher: "MMA",
    bg: "#D6E8FF",
    bar: "#2F6FDE",
    sub: "#2C4A73",
  },
  net: {
    title: "Computer Networking",
    titleBn: "কম্পিউটার নেটওয়ার্কিং",
    teacher: "RH",
    bg: "#CDEFDD",
    bar: "#2E9E6B",
    sub: "#3F5A4C",
  },
  dbms: {
    title: "Database Management System",
    titleBn: "ডাটাবেস ম্যানেজমেন্ট সিস্টেম",
    teacher: "TH",
    bg: "#FFEBB0",
    bar: "#C98F00",
    sub: "#6B5A22",
  },
  mcu: {
    title: "Microcontroller Based System Design and Development",
    titleBn: "মাইক্রোকন্ট্রোলার বেইজড সিস্টেম ডিজাইন এন্ড ডেভেলপমেন্ট",
    teacher: "PC",
    bg: "#DCD6FF",
    bar: "#4A3BD8",
    sub: "#4A4670",
  },
  iot: {
    title: "Sensor and IoT System",
    titleBn: "সেন্সর এন্ড আইওটি সিস্টেম",
    teacher: "TH",
    bg: "#FFD6E0",
    bar: "#D6336C",
    sub: "#6E3548",
  },
  mkt: {
    title: "Principles of Marketing",
    titleBn: "প্রিন্সিপলস অব মার্কেটিং",
    teacher: "MCK",
    bg: "#FFE0CC",
    bar: "#E8590C",
    sub: "#7A3A14",
  },
  ind: {
    title: "Industrial Management",
    titleBn: "ইন্ডাস্ট্রিয়াল ম্যানেজমেন্ট",
    teacher: "MCK",
    bg: "#D3F0F3",
    bar: "#0C8599",
    sub: "#1F5058",
  },
  surv: {
    title: "Surveillance Security System",
    titleBn: "সার্ভেইল্যান্স সিকিউরিটি সিস্টেম",
    teacher: "WI",
    bg: "#E6E9EF",
    bar: "#495057",
    sub: "#3B4048",
  },
};

// Day index: 0 = Sunday ... 4 = Thursday. Periods are 1 to 7.
export const SCHEDULE: Record<number, ScheduleEntry[]> = {
  // Sunday
  0: [
    { from: 1, to: 3, subject: "web", room: "Room 305" },
    { from: 4, to: 4, subject: "net", room: "Room 302" },
    { from: 5, to: 7, subject: "dbms", room: "Room 305" },
  ],
  // Monday
  1: [
    { from: 1, to: 3, subject: "mcu", room: "Room 212" },
    { from: 4, to: 4, subject: "iot", room: "Room 302" },
    { from: 5, to: 5, subject: "mkt", room: "Room 302" },
    { from: 6, to: 7, subject: "dbms", room: "Room 302" },
  ],
  // Tuesday
  2: [
    { from: 1, to: 3, subject: "net", room: "Room 301" },
    { from: 4, to: 4, subject: "iot", room: "Room 302" },
    { from: 5, to: 7, subject: "mcu", room: "Room 212" },
  ],
  // Wednesday
  3: [
    { from: 1, to: 1, subject: "mkt", room: "Room 302" },
    { from: 2, to: 2, subject: "mcu", room: "Room 302" },
    { from: 3, to: 3, subject: "dbms", room: "Room 305" },
    { from: 4, to: 4, subject: "ind", room: "Room 302" },
    { from: 5, to: 7, subject: "surv", room: "Room 301" },
  ],
  // Thursday
  4: [
    { from: 1, to: 3, subject: "iot", room: "Room 201" },
    { from: 4, to: 4, subject: "surv", room: "Room 302" },
    { from: 5, to: 5, subject: "net", room: "Room 302" },
    { from: 6, to: 6, subject: "ind", room: "Room 302" },
    { from: 7, to: 7, subject: "mcu", room: "Room 302" },
  ],
};

export const MIN_GAP_TO_SHOW = 40; // show a "free period" row for gaps of 40+ min

/* =====================================================
   Helpers
   ===================================================== */
export const getClasses = (dayIdx: number): ClassItem[] =>
  (SCHEDULE[dayIdx] || []).map((e) => ({
    id: `${dayIdx}-${e.from}`,
    ...SUBJECTS[e.subject],
    room: e.room,
    start: PERIODS[e.from - 1].start,
    end: PERIODS[e.to - 1].end,
    periodFrom: e.from,
    periodTo: e.to,
  }));

export const fmtTime = (min: number): string => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ap}`;
};
export const fmtDuration = (mins: number): string => {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h} hours`;
};
export const minutesOfDay = (d: Date): number =>
  d.getHours() * 60 + d.getMinutes();

// first class day after today (looks up to 7 days ahead)
export function findNextClassDay(now: Date): NextClassDay | null {
  for (let i = 1; i <= 7; i++) {
    const idx = (now.getDay() + i) % 7;
    const list = getClasses(idx);
    if (list.length) return { offset: i, dayIdx: idx, first: list[0] };
  }
  return null;
}
export const dayLabelFor = (offset: number, idx: number): string =>
  offset === 1 ? "Tomorrow" : DAY_FULL[idx];
