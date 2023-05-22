export type EventName = `on${string}`;

export function isEventName(name: string) {
    return name.startsWith("on");
}

export function getEventName(name: string) {
    return name.slice(2);
}
