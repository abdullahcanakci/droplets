import type { StageHandler } from '../../types';

import type { StageInterface } from './types';

class SingleStage<T> implements StageInterface<T> {
  constructor(private stage: StageHandler<T>) {}

  async run(context: T): Promise<boolean> {
    return await this.stage(context);
  }
}

export default SingleStage;
