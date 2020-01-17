/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export abstract class FrameworkAction {
    constructor() {
        if (this.constructor === FrameworkAction) throw new InvalidOperationException("Invalid constructor");

        this.__ExecutedEvent = new FrameworkEvent();
    }

    execute(data?: Dictionary<string, any>): void {
        this.__ExecutedEvent.invoke(this, {
            data: data
        });
    }

    get ExecutedEvent() { return this.__ExecutedEvent; }
    private __ExecutedEvent: FrameworkEvent;
}