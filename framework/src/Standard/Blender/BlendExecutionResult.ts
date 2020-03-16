export type BlendExecutionResult<TResult> = {
    hasResult: boolean;
    result: TResult;
};

export namespace BlendExecutionResult {
    export function create<TResult>(result: TResult, hasResult: boolean = true): BlendExecutionResult<TResult> {
        return {
            hasResult,
            result
        };
    }
}
