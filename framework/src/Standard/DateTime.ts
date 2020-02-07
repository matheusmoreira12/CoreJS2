import { RegExpXContext } from "./Strings/RegExpXContext";
import { ArgumentTypeException, ArgumentOutOfRangeException } from "./index";
import { Enumeration } from "./Enumeration";

const REGEXPX_CONTEXT = new RegExpXContext();
REGEXPX_CONTEXT.declareNamedPattern("year", `y{1,4}`);
REGEXPX_CONTEXT.declareNamedPattern("month", `M{1,4}`);
REGEXPX_CONTEXT.declareNamedPattern("day", `d{1,4}`);
REGEXPX_CONTEXT.declareNamedPattern("hour12", `h{1,2}`);
REGEXPX_CONTEXT.declareNamedPattern("amPm", `t{1,2}`);
REGEXPX_CONTEXT.declareNamedPattern("hour24", `H{1,2}`);
REGEXPX_CONTEXT.declareNamedPattern("minute", `m{1,2}`);
REGEXPX_CONTEXT.declareNamedPattern("second", `s{1,2}`);
REGEXPX_CONTEXT.declareNamedPattern("fraction", `f{1,7}`);
REGEXPX_CONTEXT.declareNamedPattern("timeZone", `z{1,3}`);

const FORMAT_SPECIFIER_REGEXPX = REGEXPX_CONTEXT.createRegExpX(`\\b($year;|$month;|$day;|$hour12;|$amPm;|$hour24;|$minute;|$second;|$fraction;|$timeZone;)\\b`, "g");

const MONTHS_IN_YEAR = 12;

const TICKS_IN_MILLISECOND = 10;
const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const addTimeSpans = (a, b) => new TimeSpan(a.ticks + b.ticks);
const subtractTimeSpans = (a, b) => new TimeSpan(a.ticks - b.ticks);
const multiplyTimeSpanByNumber = (a, b) => new TimeSpan(a.ticks * b);
const subtractDateTimes = (a, b) => new TimeSpan(a.ticks - b.ticks);
const addTimeSpanToDateTime = (a, b) => new DateTime(a.ticks + b.ticks);
const subtractTimeSpanFromDateTime = (a, b) => new DateTime(a.ticks - b.ticks);

const DEFAULT_TIMESPAN_FORMAT = "d.hh:mm:ss.fffffff";

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

    constructor(ticks) {
        this.__ticks = ticks;
    }

    toString(format = DEFAULT_TIMESPAN_FORMAT) {
        ///TODO: Implement a non-hardcoded way of converting a DateTime to string using the specified format

        const getPaddedValue = (value, quantifier) => {
            return String(value).padStart(quantifier, "0");
        };

        const getDaysString = quantifier => {
            if (quantifier > 1)
                throw "";

            return String(this.days);
        };

        const getHoursString = quantifier => {
            return getPaddedValue(this.hours, quantifier);
        };

        const getMinutesString = quantifier => {
            return getPaddedValue(this.minutes, quantifier);
        };

        const getSecondsString = quantifier => {
            return getPaddedValue(this.seconds, quantifier);
        };

        const getFractionsString = quantifier => {
            const fractions = this.getFractions(quantifier);
            return getPaddedValue(fractions, quantifier);
        }

        const formatSpecifierReplacer = match => {
            switch (match[0]) {
                case "d":
                    return getDaysString(match.length);
                case "h":
                    return getHoursString(match.length);
                case "m":
                    return getMinutesString(match.length);
                case "s":
                    return getSecondsString(match.length);
                case "f":
                    return getFractionsString(match.length);
                default:
                    return match;
            }
        };

        let result = format.replace(FORMAT_SPECIFIER_REGEXPX, formatSpecifierReplacer);
        return result;
    }

    multiply(value: number): TimeSpan {
        if (typeof value === "number")
            return multiplyTimeSpanByNumber(this, value);

        throw new ArgumentTypeException("value", value, Number);
    }

    divide(value: number): TimeSpan { return this.multiply(1 / value); }

    add(value: DateTime): DateTime;
    add(value: TimeSpan): TimeSpan;
    add(value: DateTime | TimeSpan): DateTime | TimeSpan {
        if (value instanceof DateTime)
            return addTimeSpanToDateTime(value, this);
        else if (value instanceof TimeSpan)
            return addTimeSpans(value, this);

        throw new ArgumentTypeException("value", value, DateTime);
    }

    subtract(value: TimeSpan): TimeSpan {
        if (value instanceof TimeSpan)
            return subtractTimeSpans(this, value);

        throw new ArgumentTypeException("value", value, TimeSpan);
    }

    get totalTicks() {
        return this.__ticks;
    }

    get totalMilliseconds() {
        return this.__ticks / TICKS_IN_MILLISECOND;
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

    get days() {
        return Math.trunc(this.totalDays);
    }

    get hours() {
        return Math.trunc(this.totalHours % HOURS_IN_DAY);
    }

    get minutes() {
        return Math.trunc(this.totalMinutes % MINUTES_IN_HOUR);
    }

    get seconds() {
        return Math.trunc(this.totalSeconds % SECONDS_IN_MINUTE);
    }

    get milliseconds() {
        return Math.trunc(this.totalMilliseconds % MILLISECONDS_IN_SECOND);
    }

    getFractions(precision = 1) {
        const secs = this.totalSeconds;
        return Math.trunc(secs % 1 * Math.pow(10, precision));
    }

    private __ticks: number;
}

const GregorianCalendar = {
    getIsCenturialYear(year) {
        return year % 100 === 0;
    },

    getIsLeapYear(year) {
        return year % 400 === 0 || year % 4 === 0 && !this.getIsCenturialYear(year);
    },

    getDaysInMonth(month, year) {
        if (month <= 0 || month > MONTHS_IN_YEAR)
            throw new ArgumentOutOfRangeException("month");

        switch (month) {
            case 2:
                return this.getIsLeapYear(year) ? 29 : 28;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            default:
                return 31;
        }
    },

    getDate(ticks) {
        const daysFromEpoch = new DateTime(ticks).subtract(new DateTime(0)).totalDays;
        let days = 0;

        for (let year = 1; ; year++) {
            for (let month = 1; month <= MONTHS_IN_YEAR; month++) {
                const daysInMonth = this.getDaysInMonth(month, year);
                if (days + daysInMonth > daysFromEpoch)
                    return {
                        day: Math.trunc(daysFromEpoch - days) + 1,
                        month,
                        year
                    };
                days += daysInMonth;
            }
        }
    },

    getTime(ticks) {
        const timeFromEpoch = new DateTime(ticks).subtract(new DateTime(0)),
            millisFromEpoch = timeFromEpoch.totalMilliseconds,
            secsFromEpoch = timeFromEpoch.totalSeconds,
            minsFromEpoch = timeFromEpoch.totalMinutes,
            hoursFromEpoch = timeFromEpoch.totalHours;

        const milli = Math.round(millisFromEpoch % MILLISECONDS_IN_SECOND),
            sec = secsFromEpoch % SECONDS_IN_MINUTE,
            min = Math.round(minsFromEpoch % MINUTES_IN_HOUR),
            hour = Math.round(hoursFromEpoch % HOURS_IN_DAY);

        return {
            millisecond: milli,
            second: sec,
            minute: min,
            hour,
            timeOfDay: hour >= 12 ? TimeOfDay.AnteMeridiem : TimeOfDay.PostMeridiem
        };
    },

    getEra(ticks) {
        return ticks > 0 ? DateTimeEra.AnnoDomini : DateTimeEra.BeforeChrist;
    }
};

export const DateTimeEra = Enumeration.create({
    BeforeChrist: null,
    AnnoDomin: null
});

export const TimeOfDay = Enumeration.create({
    AnteMeridiem: null,
    PostMeridie: null
});

const EPOCH_TO_NATIVE = new Date(Date.UTC(1, 0, 1, 0, 0, 0, 0)).setUTCFullYear(1);

const DEFAULT_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss.fffffff z";

export class DateTime {
    static fromNativeDateTimeStamp(dateTimeStamp): DateTime {
        const ticks = (dateTimeStamp - EPOCH_TO_NATIVE) * TICKS_IN_MILLISECOND;
        return new DateTime(ticks);
    }

    static fromUTC(year, month, date, hours = 0, minutes = 0, seconds = 0, millis = 0): DateTime {
        const dateTimeStamp = Date.UTC(year, month - 1, date, hours, minutes, seconds, millis);
        return DateTime.fromNativeDateTimeStamp(dateTimeStamp);
    }

    static get now(): DateTime {
        let dateTimeStamp = Date.now();
        return DateTime.fromNativeDateTimeStamp(dateTimeStamp);
    }

    constructor(ticks) {
        this.__ticks = ticks;
    }

    toString(format: string = DEFAULT_DATETIME_FORMAT): string {
        ///TODO: Implement a non-hardcoded way of converting a TimeSpan to string using the specified format

        const getPaddedValue = (value, quantifier) => {
            return String(value).padStart(quantifier, "0");
        };

        const getYearString = quantifier => {
            let year = this.year;
            switch (quantifier) {
                case 2:
                    year = year % 100;
                    break;
                case 3:
                    year = year % 1000;
                    break;
            }

            return getPaddedValue(year, quantifier);
        };

        const getMonthString = quantifier => {
            return getPaddedValue(this.month, quantifier);
        };

        const getDayString = quantifier => {
            return getPaddedValue(this.day, quantifier);
        };

        const getHourString = quantifier => {
            return getPaddedValue(this.hour, quantifier);
        };

        const getHour12String = quantifier => {
            const hours = this.hour % 12;
            return getPaddedValue(hours, quantifier);
        };

        const getTimeOfDayString = quantifier => {
            const timeOfDayStr = this.timeOfDay == TimeOfDay.AnteMeridiem ? "AM" : "PM";

            return timeOfDayStr.slice(0, quantifier - 1);
        }

        const getMinuteString = quantifier => {
            return getPaddedValue(this.minute, quantifier);
        };

        const getSecondString = quantifier => {
            return getPaddedValue(this.second, quantifier);
        };

        const getFractionString = quantifier => {
            const fraction = this.getFraction(quantifier);
            return getPaddedValue(fraction, quantifier);
        }

        const getTimeZoneString = quantifier => {
            return null;
        }

        const formatSpecifierReplacer = match => {
            switch (match[0]) {
                case "y":
                    return getYearString(match.length);
                case "M":
                    return getMonthString(match.length);
                case "d":
                    return getDayString(match.length);
                case "h":
                    return getHour12String(match.length);
                case "H":
                    return getHourString(match.length);
                case "t":
                    return getTimeOfDayString(match.length);
                case "m":
                    return getMinuteString(match.length);
                case "s":
                    return getSecondString(match.length);
                case "f":
                    return getFractionString(match.length);
                case "z":
                    return getTimeZoneString(match.length);
                default:
                    return match;
            }
        };

        let result = format.replace(FORMAT_SPECIFIER_REGEXPX, formatSpecifierReplacer);
        return result;
    }

    subtract(value: DateTime): TimeSpan;
    subtract(value: TimeSpan): DateTime;
    subtract(value: DateTime | TimeSpan): DateTime | TimeSpan {
        if (value instanceof DateTime)
            return subtractDateTimes(this, value);
        else if (value instanceof TimeSpan)
            return subtractTimeSpanFromDateTime(this, value);

        throw new ArgumentTypeException("value", value, DateTime);
    }

    add(value: TimeSpan): DateTime {
        if (value instanceof TimeSpan)
            return addTimeSpanToDateTime(this, value);

        throw new ArgumentTypeException("value", value, TimeSpan);
    }

    get era(): number {
        return GregorianCalendar.getEra(this.__ticks);
    }

    get year(): number {
        return GregorianCalendar.getDate(this.__ticks).year;
    }

    get month(): number {
        return GregorianCalendar.getDate(this.__ticks).month;
    }

    get day(): number {
        return GregorianCalendar.getDate(this.__ticks).day;
    }

    get timeOfDay(): number {
        return GregorianCalendar.getTime(this.__ticks).timeOfDay;
    }

    get hour(): number {
        return GregorianCalendar.getTime(this.__ticks).hour;
    }

    get minute(): number {
        return GregorianCalendar.getTime(this.__ticks).minute;
    }

    get second(): number {
        let sec = GregorianCalendar.getTime(this.__ticks).second;
        return Math.trunc(sec);
    }

    get millisecond(): number {
        return GregorianCalendar.getTime(this.__ticks).millisecond;
    }

    getFraction(precision = 1): number {
        const secs = this.second;
        return Math.trunc(secs % 1 * Math.pow(10, precision));
    }

    private __ticks: number;
}