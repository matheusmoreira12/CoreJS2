import { RegExpXContext, RegExpX } from "./Standard.Strings";

const TICKS_PER_MILLISECOND = 10;

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

export class DateTime {
    static now() {
        let ticks = Date.now() * TICKS_PER_MILLISECOND;
        return new DateTime(ticks);
    }

    constructor(ticks) {
        this.ticks = ticks;

        return Object.freeze(ticks);
    }

    toString(fornat) {

    }
}