import type { StageHandler } from '../../types';

import type { StageInterface } from './types';

class ParallelStage<T> implements StageInterface<T> {
  constructor(private stages: StageHandler<T>[]) {}

  async run(context: T): Promise<boolean> {
    // if a non async stage is present it is called ahead of async stages
    const results = await Promise.all(this.stages.map((stage) => stage(context)));

    return results.some((result) => !result);
  }
}

export default ParallelStage;
