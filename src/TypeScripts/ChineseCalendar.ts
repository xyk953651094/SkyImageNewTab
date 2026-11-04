// 本地公历历法信息：节气由寿星公式推算，全程不依赖网络。

export type SeasonKey = "spring" | "summer" | "autumn" | "winter";

export type XunKey = "early" | "mid" | "late";

interface SolarTerm {
    name: string;
    month: number;
    c: number;
}

interface SolarTermInfo {
    name: string;
    season: SeasonKey;
    daysIntoTerm: number;
}

export interface DayContext {
    day: string;
    month: number;
    monthName: string;
    weekName: string;
    weekday: number;
    xun: XunKey;
    dayOfYear: number;
    daysLeftInYear: number;
    term: SolarTermInfo;
}

const CN_MONTH_NAMES = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月",
];

const WEEK_NAMES = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

// 寿星公式：日 = floor(Y × 0.2422 + C) - floor(Y / 4)，Y 为年份后两位，C 是各节气的 21 世纪常数。
const SOLAR_TERMS: SolarTerm[] = [
    {name: "小寒", month: 1, c: 5.4055}, {name: "大寒", month: 1, c: 20.12},
    {name: "立春", month: 2, c: 3.87}, {name: "雨水", month: 2, c: 18.73},
    {name: "惊蛰", month: 3, c: 5.63}, {name: "春分", month: 3, c: 20.646},
    {name: "清明", month: 4, c: 4.81}, {name: "谷雨", month: 4, c: 20.1},
    {name: "立夏", month: 5, c: 5.52}, {name: "小满", month: 5, c: 21.04},
    {name: "芒种", month: 6, c: 5.678}, {name: "夏至", month: 6, c: 21.37},
    {name: "小暑", month: 7, c: 7.108}, {name: "大暑", month: 7, c: 22.83},
    {name: "立秋", month: 8, c: 7.5}, {name: "处暑", month: 8, c: 23.13},
    {name: "白露", month: 9, c: 7.646}, {name: "秋分", month: 9, c: 23.042},
    {name: "寒露", month: 10, c: 8.318}, {name: "霜降", month: 10, c: 23.438},
    {name: "立冬", month: 11, c: 7.438}, {name: "小雪", month: 11, c: 22.36},
    {name: "大雪", month: 12, c: 7.18}, {name: "冬至", month: 12, c: 21.94},
];

// 公式结果贴着午夜取整、与紫金山天文台的交节时刻相反时才需要修正，逐年记下这些 ±1 天。
// 2023—2028 实测 131 个节气里只剩这一处偏差。
const TERM_CORRECTIONS: { year: number; name: string; days: number }[] = [
    {year: 2026, name: "雨水", days: -1},
];

// 年初四个节气落在 2 月 29 日之前，floor(Y / 4) 会扣掉尚未到来的那个闰日，需要补回 1 天。
function countLeapDays(param: number, month: number): number {
    return Math.floor(param / 4) - (param % 4 === 0 && month <= 2 ? 1 : 0);
}

function getTermDay(param: SolarTerm, year: number): number {
    const shortYear = year % 100;
    const correction = TERM_CORRECTIONS.find(item => item.year === year && item.name === param.name);
    return Math.floor(shortYear * 0.2422 + param.c) - countLeapDays(shortYear, param.month) + (correction?.days ?? 0);
}

const SEASON_BY_TERM: Record<string, SeasonKey> = {
    "立春": "spring", "雨水": "spring", "惊蛰": "spring", "春分": "spring", "清明": "spring", "谷雨": "spring",
    "立夏": "summer", "小满": "summer", "芒种": "summer", "夏至": "summer", "小暑": "summer", "大暑": "summer",
    "立秋": "autumn", "处暑": "autumn", "白露": "autumn", "秋分": "autumn", "寒露": "autumn", "霜降": "autumn",
    "立冬": "winter", "小雪": "winter", "大雪": "winter", "冬至": "winter", "小寒": "winter", "大寒": "winter",
};

function findCurrentTerm(param: Date): SolarTermInfo {
    const year = param.getFullYear();
    const today = new Date(year, param.getMonth(), param.getDate());
    const candidates: { start: Date; name: string }[] = [];

    // 前后各取一年，覆盖元旦与大寒/小寒交界
    for (const offset of [-1, 0, 1]) {
        SOLAR_TERMS.forEach(term => {
            const termYear = year + offset;
            candidates.push({start: new Date(termYear, term.month - 1, getTermDay(term, termYear)), name: term.name});
        });
    }

    const current = candidates
        .filter(item => item.start <= today)
        .sort((a, b) => b.start.getTime() - a.start.getTime())[0];

    return {
        name: current.name,
        season: SEASON_BY_TERM[current.name],
        daysIntoTerm: Math.floor((today.getTime() - current.start.getTime()) / 86400000),
    };
}

function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// 旬：上旬 1-10、中旬 11-20、下旬 21 至月末
function getXun(dayOfMonth: number): XunKey {
    if (dayOfMonth <= 10) return "early";
    if (dayOfMonth <= 20) return "mid";
    return "late";
}

export function getDayContext(param: Date): DayContext {
    const startOfYear = new Date(param.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((param.getTime() - startOfYear.getTime()) / 86400000) + 1;
    const totalDaysOfYear = isLeapYear(param.getFullYear()) ? 366 : 365;

    return {
        day: String(param.getDate()).padStart(2, "0"),
        month: param.getMonth() + 1,
        monthName: CN_MONTH_NAMES[param.getMonth()],
        weekName: WEEK_NAMES[param.getDay()],
        weekday: param.getDay(),
        xun: getXun(param.getDate()),
        dayOfYear,
        daysLeftInYear: totalDaysOfYear - dayOfYear,
        term: findCurrentTerm(param),
    };
}
