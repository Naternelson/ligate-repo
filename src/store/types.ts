
export type ActionPayload<T> = {type: string, payload:T}
export type CaseReducer<T, S> = (state: S, action:ActionPayload<T>) => S