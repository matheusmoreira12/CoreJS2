export declare class TimeSpan {
    static fromMilliseconds(millis: any): TimeSpan;
    static fromSeconds(secs: any): TimeSpan;
    static fromMinutes(mins: any): TimeSpan;
    static fromHours(hours: any): TimeSpan;
    static fromDays(days: any): TimeSpan;
    constructor(ticks: any);
    toString(format?: string): string;
    multiply(value: any): TimeSpan;
    add(value: any): TimeSpan | DateTime;
    subtract(value: any): TimeSpan;
    readonly totalMilliseconds: number;
    readonly totalSeconds: number;
    readonly totalMinutes: number;
    readonly totalHours: number;
    readonly totalDays: number;
    readonly years: any;
    readonly months: number;
    readonly days: number;
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
    readonly milliseconds: number;
    getFractions(precision?: number): number;
}
export declare const DateTimeEra: any;
export declare class DateTime {
    static fromNativeDateTimeStamp(dateTimeStamp: any): DateTime;
    static fromUTC(year: any, month: any, date: any, hours?: number, minutes?: number, seconds?: number, millis?: number): DateTime;
    static readonly now: DateTime;
    constructor(ticks: any);
    toString(format?: string): string;
    subtract(value: any): TimeSpan | DateTime;
    add(value: any): DateTime;
    readonly era: any;
    readonly year: number;
    readonly month: number;
    readonly day: number;
    readonly hour: number;
    readonly minute: number;
    readonly second: number;
    readonly millisecond: number;
    getFraction(precision?: number): number;
}
