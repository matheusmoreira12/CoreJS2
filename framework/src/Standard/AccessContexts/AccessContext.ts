export type AccessContext<TTarget extends object> = TTarget & {
    public: TTarget;
}

export namespace AccessContext {
    export function createFor<T extends object>(obj: T): AccessContext<T> {
        const context: AccessContext<T> = Object.create(obj);
        context.public = obj;
        return context;
    }
}