export declare abstract class Destructible {
    constructor();
    protected abstract destructor(): any;
    destruct(): void;
    readonly isDestructed: boolean;
    private __isDestructed;
}
