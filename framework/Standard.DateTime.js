import { RegExpXContext, RegExpX } from "./Standard.Strings";
import { MathX } from "./Standard.MathX";
import { FormatException } from "./exceptions";
import { Enumeration } from "./Standard.Enumeration";

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

const EPOCH_TO_NATIVE = Date.UTC(1, 1, 1, 0, 0, 0, 0);

export class TimeSpan {
    static fromMilliseconds(millis) {
        let ticks = millis * TICKS_IN_MILLISECOND;
        return new DateTime(ticks);
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

function getDateAsTuple(ticks) {
    const daysSinceEpoch = new TimeSpan(ticks).totalDays;
    let d = 1;

    let year = 1;
    for (; d <= daysSinceEpoch; d += getDaysInYear(year)) //Loop through the years, until the number of days overshoots
        year++;

    let month = MONTHS_IN_YEAR;
    for (; d >= daysSinceEpoch; d -= getDaysInMonth(month)) //Loop back through the months, until the number of days undershoots
        month--;

    let date = daysSinceEpoch - d; //Store the number of days undershot as the current date

    return { date, month, year };
}

export const DateTimeEra = new Enumeration([
    BeforeChrist,
    AnnoDomini
]);

export class DateTime {
    static subtract(dateA, dateB) {
        let diffTicks = Number(dateA) - Number(dateB);
        return new TimeSpan(diffTicks);
    }

    static sum(date, span) {
        let sumTicks = Number(date) + Number(span);
        return new DateTime(sumTicks);
    }

    static fromUTC(year, month, date, hours = 0, minutes = 0, seconds = 0, millis = 0) {
        const nativeDate = Date.UTC(year, month, date, hours, minutes, seconds, millis);
        const ticks = (nativeDate - EPOCH_TO_NATIVE) * TICKS_IN_MILLISECOND;
        return new DateTime(ticks);
    }

    static get now() {
        let ticks = (Date.now() - EPOCH_TO_NATIVE) * TICKS_IN_MILLISECOND;
        return new DateTime(ticks);
    }

    constructor(ticks) {
        this.ticks = ticks;

        return Object.freeze(this);
    }

    get era() {
        return this.ticks > 0 ? CalendarEra.AnnoDomini : CalendarEra.BeforeChrist;
    }

    get year() {
    }

    get month() {
    }

    get date() {
    }

    get hours() {
    }

    get minutes() {
    }

    get seconds() {
    }

    get millis() {
    }
}