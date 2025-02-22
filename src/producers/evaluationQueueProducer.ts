import evaluationQueue from "../queues/evaluationQueue";
import { EVALUATION_JOB } from "../utils/constants";

export default async function (payload: Record<string, unknown>) {
  const job = await evaluationQueue.add(EVALUATION_JOB, payload);

  return job;
}
