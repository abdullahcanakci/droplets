import type { ConditionHandler, ErrorHandler, StageHandler } from '../types';

import Processor from './processors/Processor';
import ConditionalStage from './stages/ConditionalStage';
import ErrorStage from './stages/ErrorStage';
import ParallelStage from './stages/ParallelStage';
import SingleStage from './stages/SingleStage';
import type { StageInterface } from './stages/types';

class Droplets<DropletContext> {
  private stages: Array<StageInterface<DropletContext>>;

  constructor() {
    this.stages = [];
  }

  /**
   * Adds a sequential stage to the end of the pipeline.
   */
  add(stage: StageHandler<DropletContext>): this {
    this.stages.push(new SingleStage(stage));

    return this;
  }

  /**
   * Adds multiple state functions to be executed in parallel at this point
   * in the sequence. The pipeline waits for all parallel stages to complete
   * before proceeding to the next step *after* the parallel block.
   *
   * Note: All parallel stages operate on the *same* context object instance.
   * Be mindful of potential race conditions if multiple parallel tasks modify
   * the same context properties concurrently.
   */
  parallel(...stages: StageHandler<DropletContext>[]): this {
    this.stages.push(new ParallelStage(stages));

    return this;
  }

  /**
   * Conditionally adds state or configures a sub-pipeline.
   * The condition is evaluated when the pipeline reaches this point during execution.
   */
  when(
    condition: ConditionHandler<DropletContext>,
    ...stages: StageHandler<DropletContext>[]
  ): this {
    const stage = stages.length === 1 ? new SingleStage(stages[0]) : new ParallelStage(stages);

    this.stages.push(new ConditionalStage(condition, stage));

    return this;
  }

  /**
   * Adds an error handler for state added *before* this point within the current scope
   * (e.g., within the main pipeline or a 'when' block).
   * If an error occurs in preceding stage, the execution jumps to the nearest
   * appropriate catch handler. If the handler completes normally (doesn't re-throw),
   * execution continues *after* the block associated with the catch.
   */
  catch(handler: ErrorHandler<DropletContext>): this {
    this.stages.push(new ErrorStage(handler));

    return this;
  }
  //
  // /**
  //  * Creates a stage function from this entire droplet instance.
  //  * Useful for composing pipelines using `use()`.
  //  *
  //  */
  // as(): Droplets<DropletContext> {
  //     return this;
  // }
  //
  // /**
  //  * Composes another pipeline into this one.
  //  * Executes all steps of the provided droplet.
  //  */
  // use(context: Droplets<DropletContext>): this {
  //     return this;
  // }
  //
  //
  // /**
  //  * Adds a stage that is run after each stage,
  //  * Will *BE* bypassed in case of stage failure.
  //  */
  // each(stage: StageHandler<DropletContext>): this {
  //     return this;
  // }
  //
  // /**
  //  * Adds a stage that is *NOT* run after each stage,
  //  * Will not be bypassed in case of stage failure.
  //  */
  // tap(stage: StageHandler<DropletContext>): this {
  //     return this;
  // }

  /**
   * Executes the pipeline with the given initial context.
   */
  async run(context: DropletContext): Promise<DropletContext> {
    await new Processor(this.stages).run(context);

    return context;
  }
}

export default Droplets;
