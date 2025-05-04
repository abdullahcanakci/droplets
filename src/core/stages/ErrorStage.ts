import type { ErrorHandler } from '../../types';

import type { StageMeta, StageInterface } from './types';

class ErrorStage<T> implements StageInterface<T> {
  constructor(private stage: ErrorHandler<T>) {}

  async run(context: T, meta: StageMeta): Promise<boolean> {
    if (meta.error === null) {
      return true;
    }

    try {
      return await this.stage(meta.error, context);
    } catch (error) {
      return false;
    }
  }
}

export default ErrorStage;
