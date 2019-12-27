export declare abstract class Destructible {
    constructor();
    protected abstract destructor(): any;
    destruct(): void;
    get isDestructed(): boolean;
    private __isDestructed;
}
