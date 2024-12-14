import { Job, Worker } from "bullmq";

import redisConnection from "../config/redisConfig";
import SubmissionJob from "../jobs/SubmissionJob";

export default function SubmissionWorker(queueName: string) {
  new Worker(
    queueName,
    async (job: Job) => {
      if (job.name === "SubmissionJob") {
        const submissionJob = new SubmissionJob(job.data);
        console.log(job?.data, job?.name, job?.id);
        submissionJob.handle();
      }
      return true;
    },
    { connection: redisConnection }
  );
}
