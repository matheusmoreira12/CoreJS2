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
REGEXPX_CONTEXT.declareNamedPattern("fraction", `f{1,7}`);

const FORMAT_SPECIFIER_REGEXPX = REGEXPX_CONTEXT.createRegExpX(`\\b($day;|$hour12;|$hour24;|$minute;|$second;|$amPm;|$year;|$fraction;)\\b`, "g");

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
        this.ticks = ticks;

        return Object.freeze(this);
    }

    toString(format = DEFAULT_TIMESPAN_FORMAT) {
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

        const getYearsString = quantifier => {
            let years = this.years;
            if (quantifier)
                years = years % 100;

            return getPaddedValue(this.days, quantifier);
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
                case "y":
                    return getYearsString(match.length);
                case "f":
                    return getFractionsString(match.length);
            }
        };

        let result = format.replace(FORMAT_SPECIFIER_REGEXPX, formatSpecifierReplacer);
        return result;
    }

    multiply(value) {
        if (typeof value === "number")
            return multiplyTimeSpanByNumber(this, value);

        throw new ArgumentTypeException("value", Type.of(value), Type.get(Number));
    }

    add(value) {
        if (value instanceof DateTime)
            return addTimeSpanToDateTime(value, this);
        else if (value instanceof TimeSpan)
            return addTimeSpans(value, this);

        throw new ArgumentTypeException("value", Type.of(value), Type.get(DateTime));
    }

    subtract(value) {
        if (value instanceof TimeSpan)
            return subtractTimeSpans(this, value);

        throw new ArgumentTypeException("value", Type.of(value), Type.get(TimeSpan));
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

    get years() {
        return this.totalYears;
    }

    get months() {
        return Math.trunc(this.totalMonths % MONTHS_IN_YEAR);
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
}

const GregorianCalendar = {
    getIsCenturialYear(year) {
        return year % 100 === 0;
    },

    getIsLeapYear(year) {
        return year % 400 === 0 || year % 4 === 0 && !this.getIsCenturialYear(year);
    },

    getDaysInMonth(month, year) {
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

        return {
            day: null,
            month: null,
            year: null
        }
    },

    getTime(ticks) {
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
    },

    getEra(ticks) {
        return this.ticks > 0 ? CalendarEra.AnnoDomini : CalendarEra.BeforeChrist;
    }
};

export const DateTimeEra = new Enumeration([
    "BeforeChrist",
    "AnnoDomini"
]);

function getYearOne() {
    let date = new Date(1, 1, 1, 0, 0, 0, 0);
    date = date.setUTCFullYear(1);
    return date;
}

const EPOCH_TO_NATIVE = getYearOne();

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
        if (value instanceof DateTime)
            return subtractDateTimes(this, value);
        else if (value instanceof TimeSpan)
            return subtractTimeSpanFromDateTime(this, value);

        throw new ArgumentTypeException("value", Type.of(value), Type.get(DateTime));
    }

    add(value) {
        if (value instanceof TimeSpan)
            return addTimeSpanToDateTime(this, value);

        throw new ArgumentTypeException("value", Type.of(value), Type.get(TimeSpan));
    }

    get era() {
        return GregorianCalendar.getEra(this.ticks);
    }

    get year() {
        return GregorianCalendar.getDate(this.ticks).year;
    }

    get month() {
        return GregorianCalendar.getDate(this.ticks).month;
    }

    get day() {
        return GregorianCalendar.getDate(this.ticks).day;
    }

    get hour() {
        return GregorianCalendar.getTime(this.ticks).hour;
    }

    get minute() {
        return GregorianCalendar.getTime(this.ticks).minute;
    }

    get second() {
        return GregorianCalendar.getTime(this.ticks).second;
    }

    get millisecond() {
        return GregorianCalendar.getTime(this.ticks).millisecond;
    }
}