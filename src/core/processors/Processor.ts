import ErrorStage from '../stages/ErrorStage';
import type { StageInterface, StageMeta } from '../stages/types';

class Processor<T> {
  error: Error | null = null;

  constructor(private stages: StageInterface<T>[]) {}

  async run(context: T): Promise<boolean> {
    for (const stage of this.stages) {
      try {
        if (this.error !== null) {
          if (!(stage instanceof ErrorStage)) {
            continue;
          }

          const result = await stage.run(context, this.getStageMeta());

          if (result) {
            this.error = null;
            continue;
          } else {
            break;
          }
        }

        await stage.run(context, this.getStageMeta());
      } catch (error) {
        this.error = error as Error;
      }
    }

    return this.error !== null;
  }

  private getStageMeta(): StageMeta {
    return {
      error: this.error,
    };
  }
}

export default Processor;
