import { RegExpXContext, RegExpX } from "./Standard.Strings.js";
import { MathX } from "./Standard.MathX.js";
import { FormatException, ArgumentTypeException } from "./exceptions.js";
import { Enumeration } from "./Standard.Enumeration.js";
import { Type } from "./Standard.Types.js";

const REGEXPX_CONTEXT = new RegExpXContext();
REGEXPX_CONTEXT.declareNamedPattern("day", `d{1,4}`);
REGEXPX_CONTEXT.declareNamedPattern("hour12", `h{1,2}`);
REGEXPX_CONTEXT.declareNamedPattern("hour24", `H{1,2}`);
REGEXPX_CONTEXT.declareNamedPattern("minute", `m{1,2}`);
REGEXPX_CONTEXT.declareNamedPattern("second", `s{1,2}`);
REGEXPX_CONTEXT.declareNamedPattern("amPm", `t{1,2}`);
REGEXPX_CONTEXT.declareNamedPattern("year", `y{1,4}`);
REGEXPX_CONTEXT.declareNamedPattern("timeZone", `z{1,3}`);
REGEXPX_CONTEXT.declareNamedPattern("fraction", `f{1,6}`);

const FORMAT_SPECIFIER_REGEXPX = REGEXPX_CONTEXT.createRegExpX(`\b($day;|$hour12;|$hour24;|$minute;|$second;|$amPm;|$year;)\b`, "g");

const TICKS_IN_MILLISECOND = 10;
const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_MONTH = 30.4368499;
const MONTHS_IN_YEAR = 12;

export class TimeSpan {
    static fromMilliseconds(millis) {
        let ticks = millis * TICKS_IN_MILLISECOND;
        return new TimeSpan(ticks);
    }

    static fromSeconds(secs) {
        let millis = secs * MILLISECONDS_IN_SECOND;
        return this.fromMilliseconds(millis);
    }

    static fromMinutes(mins) {
        let secs = mins * SECONDS_IN_MINUTE;
        return this.fromSeconds(secs);
    }

    static fromHours(hours) {
        let mins = hours * MINUTES_IN_HOUR;
        return this.fromMinutes(mins);
    }

    static fromDays(days) {
        let hours = days * HOURS_IN_DAY;
        return this.fromHours(hours);
    }

    static fromMonths(months) {
        let days = months * DAYS_IN_MONTH;
        return this.fromDays(days);
    }

    static fromYears(years) {
        let months = years * MONTHS_IN_YEAR;
        return this.fromMonths(months);
    }

    constructor(ticks) {
        this.ticks = ticks;

        return Object.freeze(this);
    }

    multiply(value) {
        const multiplyTimeSpanByNumber = (a, b) => new TimeSpan(a.ticks * b);

        if (typeof value === "number")
            return multiplyTimeSpanByNumber(this, value);

        throw new ArgumentTypeException("value", Type.of(value), Type.get(Number));
    }

    add(value) {
        const addTimeSpans = (a, b) => new TimeSpan(a.ticks + b.ticks);

        if (value instanceof DateTime)
            return value.add(this);
        else if (value instanceof TimeSpan)
            return addTimeSpans(this, value);

        throw new ArgumentTypeException("value", Type.of(value), Type.get(DateTime));
    }

    get totalMilliseconds() {
        return this.ticks / TICKS_IN_MILLISECOND;
    }

    get totalSeconds() {
        return this.totalMilliseconds / MILLISECONDS_IN_SECOND;
    }

    get totalMinutes() {
        return this.totalSeconds / SECONDS_IN_MINUTE;
    }

    get totalHours() {
        return this.totalMinutes / MINUTES_IN_HOUR;
    }

    get totalDays() {
        return this.totalHours / HOURS_IN_DAY;
    }

    get totalMonths() {
        return this.totalDays / DAYS_IN_MONTH;
    }

    get totalYears() {
        return this.totalMonths / MONTHS_IN_YEAR;
    }

    get years() {
        return this.totalYears;
    }

    get months() {
        return Math.round(this.totalMonths % MONTHS_IN_YEAR);
    }

    get days() {
        return Math.round(this.totalDays % DAYS_IN_MONTH);
    }

    get hours() {
        return Math.round(this.totalHours % HOURS_IN_DAY);
    }

    get minutes() {
        return Math.round(this.totalMinutes % MINUTES_IN_HOUR);
    }

    get seconds() {
        return Math.round(this.totalSeconds % SECONDS_IN_MINUTE);
    }

    get milliseconds() {
        return Math.round(this.totalMilliseconds % MILLISECONDS_IN_SECOND);
    }
}

function isCenturialYear(year) {
    return year % 100 === 0;
}

function isLeapYear(year) {
    return year % 400 === 0 || year % 4 === 0 && !isCenturialYear(year);
}

function getDaysInMonth(month, year) {
    switch (month) {
        case 2:
            return isLeapYear(year) ? 29 : 28;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        default:
            return 31;
    }
}

function getDaysInYear(year) {
    let days = 0;
    for (let month = 1; month <= 12; month++)
        days += getDaysInMonth(month, year);
    return days;
}

function convertTicksToDate(ticks) {
    function getYear() {
        let year = EPOCH_YEAR - 1;
        for (let d = day; d < daysFromEpoch; d += getDaysInYear(year)) { //Loop through the years, until the number of days overshoots
            day = d;
            year++;
        }
        return year;
    }

    function getMonth() {
        let month = 1;
        for (let d = day; d < daysFromEpoch; d += getDaysInMonth(month)) { //Loop back through the months, until the number of days undershoots
            day = d;
            month++;
        }
        return month;
    }

    const daysFromEpoch = new DateTime(ticks).subtract(new DateTime(0)).totalDays;
    let day = 0;

    return {
        year: getYear(),
        month: getMonth(),
        day: Math.round(daysFromEpoch - day)
    };
}

function convertTicksToTime(ticks) {
    const timeFromEpoch = new DateTime(ticks).subtract(new DateTime(0)),
        millisFromEpoch = timeFromEpoch.milliseconds,
        secsFromEpoch = timeFromEpoch.totalSeconds,
        minsFromEpoch = timeFromEpoch.totalMinutes,
        hoursFromEpoch = timeFromEpoch.totalHours;

    const milli = Math.round(millisFromEpoch % MILLISECONDS_IN_SECOND),
        sec = Math.round(secsFromEpoch % SECONDS_IN_MINUTE),
        min = Math.round(minsFromEpoch % MINUTES_IN_HOUR),
        hour = Math.round(hoursFromEpoch % HOURS_IN_DAY);

    return {
        millisecond: milli,
        second: sec,
        minute: min,
        hour
    };
}

export const DateTimeEra = new Enumeration([
    "BeforeChrist",
    "AnnoDomini"
]);

const EPOCH_YEAR = 1970;
const EPOCH_TO_NATIVE = Date.UTC(EPOCH_YEAR, 1, 1);

export class DateTime {
    static fromNativeDateTimeStamp(dateTimeStamp) {
        const ticks = (dateTimeStamp - EPOCH_TO_NATIVE) * TICKS_IN_MILLISECOND;
        return new DateTime(ticks);
    }

    static fromUTC(year, month, date, hours = 0, minutes = 0, seconds = 0, millis = 0) {
        const dateTimeStamp = Date.UTC(year, month, date, hours, minutes, seconds, millis);
        return DateTime.fromNativeDateTimeStamp(dateTimeStamp);
    }

    static get now() {
        let dateTimeStamp = Date.now();
        return DateTime.fromNativeDateTimeStamp(dateTimeStamp);
    }

    constructor(ticks) {
        this.ticks = ticks;

        return Object.freeze(this);
    }

    subtract(value) {
        const subtractDateTimes = (a, b) => new TimeSpan(a.ticks - b.ticks);
        const subtractTimeSpanFromDateTime = (a, b) => new DateTime(a.ticks - b.ticks);

        if (value instanceof DateTime)
            return subtractDateTimes(this, value);
        else if (value instanceof TimeSpan)
            return subtractTimeSpanFromDateTime(this, value);

        throw new ArgumentTypeException("value", Type.of(value), Type.get(DateTime));
    }

    add(value) {
        const addDateTimeWithTimeSpan = (a, b) => new DateTime(a.ticks - b.ticks);

        if (value instanceof TimeSpan)
            return addDateTimeWithTimeSpan(this, value);

        throw new ArgumentTypeException("value", Type.of(value), Type.get(TimeSpan));
    }

    get era() {
        return this.ticks > 0 ? CalendarEra.AnnoDomini : CalendarEra.BeforeChrist;
    }

    get year() {
        return convertTicksToDate(this.ticks).year;
    }

    get month() {
        return convertTicksToDate(this.ticks).month;
    }

    get day() {
        return convertTicksToDate(this.ticks).day;
    }

    get hour() {
        return convertTicksToTime(this.ticks).hour;
    }

    get minute() {
        return convertTicksToTime(this.ticks).minute;
    }

    get second() {
        return convertTicksToTime(this.ticks).second;
    }

    get millisecond() {
        return convertTicksToTime(this.ticks).millisecond;
    }
}