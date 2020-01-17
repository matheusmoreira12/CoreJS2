/**
 * PropertyTrigger class
 * Triggers a group of setters when the specified property matches the specified value.
 */
export class PropertyTrigger extends Trigger {
    constructor(target: object, targetProperty: FrameworkProperty<any>, value: any, ...actions: FrameworkAction[]) {
        super();

        if (typeof target !== "object") throw new ArgumentTypeException("target", target, Object);

        if (!(targetProperty instanceof FrameworkProperty)) throw new ArgumentTypeException("targetProperty",
            targetProperty, FrameworkProperty);

        this.__target = target;
        this.__targetProperty = targetProperty;
        this.__value = value;

        targetProperty.ChangeEvent.attach(this.__targetProperty_onChange, this);
    }

    private __targetProperty_onChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.target !== this.target)
            return;
        if (args.newValue !== this.value)
            return;
    }

    get target(): object { return this.__target; }
    private __target: object;

    get targetProperty(): FrameworkProperty { return this.__targetProperty; }
    private __targetProperty: FrameworkProperty;

    get value(): any { return this.__value; }
    private __value: any;

    get setters(): Collection<Setter> { return this.__setters; }
    private __setters: Collection<Setter>;
}