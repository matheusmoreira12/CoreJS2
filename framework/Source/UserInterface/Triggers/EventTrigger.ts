/**
 * EventTrigger class
 * Triggers a group of actions upon the firing of an event.
 */
export class EventTrigger extends Trigger {
    constructor(targetEvent: FrameworkEvent, ...actions: FrameworkAction[]) {
        super();

        if (!(targetEvent instanceof FrameworkEvent))
            throw new ArgumentTypeException("targetEvent", targetEvent, FrameworkEvent);

        this.__targetEvent = targetEvent;
        this.__actions = new Collection(...actions);

        targetEvent.attach(this.__targetEvent_handler, this);
    }

    private __targetEvent_handler() {
        this.__executeActions();
    }

    protected __executeActions(data?: Dictionary<string, any>) {
        const executionErrors = [];

        for (let action of this.actions) {
            try {
                action.execute(data);
            }
            catch (e) {
                executionErrors.push(e);
            }
        }

        for (let e of executionErrors)
            throw e;
    }

    get targetEvent(): FrameworkEvent { return this.__targetEvent; }
    private __targetEvent: FrameworkEvent;

    get actions(): Collection<FrameworkAction> { return this.__actions; }
    private __actions: Collection<FrameworkAction>;
}