type PropertyNameFromEventName<TEventName extends string> = `on${TEventName}`;

export type EventPropertyName = PropertyNameFromEventName<string>;

export type EventNameFromPropertyName<TPropertyName extends string> = TPropertyName extends PropertyNameFromEventName<infer TEventName> ? TEventName : never;

export function isEventPropertyName(name: string) {
    return name.startsWith("on");
}

export function getEventNameFromPropertyName(name: string) {
    return name.slice(2);
}
