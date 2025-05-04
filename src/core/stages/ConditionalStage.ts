import type { ConditionHandler } from '../../types';

import type ParallelStage from './ParallelStage';
import type SingleStage from './SingleStage';
import type { StageInterface } from './types';

class ConditionalStage<T> implements StageInterface<T> {
  constructor(
    private condition: ConditionHandler<T>,
    private stage: ParallelStage<T> | SingleStage<T>,
  ) {}

  async run(context: T): Promise<boolean> {
    const condition = await this.condition(context);

    if (condition !== true) {
      return true;
    }

    return await this.stage.run(context);
  }
}

export default ConditionalStage;
