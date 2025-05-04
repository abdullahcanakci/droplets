type StageMeta = {
  error: null | Error;
};

interface StageInterface<T> {
  run(context: T, meta: StageMeta): Promise<boolean>;
}

export type { StageMeta, StageInterface };
