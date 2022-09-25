import { NativeEvent } from "../../../standard/events/native-event";

type GetEventName<K extends string> = K extends `on${infer L}` ? `${L}Event` : never;

export type NativeEvents<T extends typeof Element> = {
    readonly [K in keyof T["prototype"] & string as GetEventName<K>]: NativeEvent;
};
