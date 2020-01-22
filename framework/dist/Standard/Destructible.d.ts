export declare abstract class Destructible {
    constructor();
    protected abstract destructor(): void;
    destruct(): void;
    get isDestructed(): boolean;
    private __isDestructed;
}
