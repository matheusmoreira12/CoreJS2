import { RegExpXContext } from "./Standard.Strings";

const TICKS_PER_MILLISECOND = 10;

const PATTERNS = {
    DAY: ["d", "dd", "ddd", "dddd"],
    HOUR: {
        HOUR_12: ["h", "hh"],
        HOUR_24: ["H", "HH"]
    },
    MINUTE: ["m", "mm"],
    SECOND: ["s", "ss"],
    AM_PM: ["t", "tt"],
    YEAR: ["y", "yy", "yyy", "yyyy"],
    TIME_ZONE: ["z", "zz", "zzz"],
    SECOND_FRACTION: ["f", "ff", "fff", "ffff", "ffffff"]
};

export class DateTime {
    static now() {
        let ticks = Date.now() * TICKS_PER_MILLISECOND;
        return new DateTime(ticks);
    }

    constructor(ticks) {
        this.ticks = ticks;

        return Object.freeze(ticks);
    }
}