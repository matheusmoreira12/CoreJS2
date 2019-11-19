import { RegExpXContext, RegExpX } from "./Standard.Strings";

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

const TICKS_PER_MILLISECOND = 10;
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_MONTH = 30.4368499;
const MONTHS_PER_YEAR = 12;

const MIN_DATE = Date.UTC(1, 1, 1, 0, 0, 0, 0);

export class TimeSpan extends Number {
    static fromMilliseconds(millis) {
        let ticks = millis * TICKS_PER_MILLISECOND;
        return new DateTime(ticks);
    }

    static fromSeconds(secs) {
        let millis = secs * MILLISECONDS_PER_SECOND;
        return this.fromMilliseconds(millis);
    }

    static fromMinutes(mins) {
        let secs = mins * SECONDS_PER_MINUTE;
        return this.fromSeconds(secs);
    }

    static fromHours(hours) {
        let mins = hours * MINUTES_PER_HOUR;
        return this.fromMinutes(mins);
    }

    static fromDays(days) {
        let hours = days * HOURS_PER_DAY;
        return this.fromHours(hours);
    }

    static fromMonths(months) {
        let days = months * DAYS_PER_MONTH;
        return this.fromDays(days);
    }

    static fromYears(years) {
        let months = years * MONTHS_PER_YEAR;
        return this.fromMonths(months);
    }

    toString(fornat) {


        format = format.replace(FORMAT_SPECIFIER_REGEXPX, format => {
            switch (format[0]) {
                case "d":
                    switch (format.length) {
                        case 1:
                        case 2:
                            break;
                        case 3:
                            break;
                        case 4:
                            break;
                    }
                    break;
                case "h":
                    break;
                case "H":
                    break;
                case "m":
                    break;
                case "s":
                    break;
                case "t":
                    break;
                case "y":
                    break;
                case "z":
                    break;
                case "f":
                    break;
            }
        });
    }

    get totalMilliseconds() {
        return Number(this) / TICKS_PER_MILLISECOND;
    }

    get totalSeconds() {
        return this.totalMilliseconds / MILLISECONDS_PER_SECOND;
    }

    get totalMinutes() {
        return this.totalSeconds / SECONDS_PER_MINUTE;
    }

    get totalHours() {
        return this.totalMinutes / MINUTES_PER_HOUR;
    }

    get totalDays() {
        return this.totalHours / HOURS_PER_DAY;
    }

    get totalMonths() {
        return this.totalDays / DAYS_PER_MONTH;
    }

    get totalYears() {
        return this.totalMonths / MONTHS_PER_YEAR;
    }
}

export class DateTime {
    static get now() {
        let ticks = (Date.now() - MIN_DATE) * TICKS_PER_MILLISECOND;
        return new DateTime(ticks);
    }

    toString(fornat) {
        format = format.replace(FORMAT_SPECIFIER_REGEXPX, format => {
            switch (format[0]) {
                case "d":
                    switch (format.length) {
                        case 1:
                        case 2:
                            break;
                        case 3:
                            break;
                        case 4:
                            break;
                    }
                    break;
                case "h":
                    break;
                case "H":
                    break;
                case "m":
                    break;
                case "s":
                    break;
                case "t":
                    break;
                case "y":
                    break;
                case "z":
                    break;
                case "f":
                    break;
            }
        });
    }
}