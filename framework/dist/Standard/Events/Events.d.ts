export declare type FrameworkEventListener<TArgs extends object> = (sender: any, args: TArgs) => void;
export declare class FrameworkEventArgs {
    static get Empty(): FrameworkEventArgs;
}
