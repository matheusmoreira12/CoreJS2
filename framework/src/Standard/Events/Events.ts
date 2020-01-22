export type FrameworkEventListener<TArgs extends object> = (sender: any, args: TArgs) => void;

export class FrameworkEventArgs {
    static get Empty() { return new FrameworkEventArgs(); }
}