type DropletContext<T> = Record<string, T>;
type StageHandler<T> = (context: T) => Promise<boolean> | boolean;
type ConditionHandler<T> = (context: T) => Promise<boolean> | boolean;
type ErrorHandler<T> = (error: Error, context: T) => Promise<boolean> | boolean;

export type { DropletContext, StageHandler, ConditionHandler, ErrorHandler };
