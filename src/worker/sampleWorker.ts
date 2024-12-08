import { Job, Worker } from "bullmq";

import redisConnection from "../config/redisConfig";
import SampleJob from "../jobs/SampleJob";

export default function SampleWorker(queueName: string) {
  new Worker(
    queueName,
    async (job: Job) => {
      if (job.name === "SampleJob") {
        const sampleJob = new SampleJob(job.data);
        console.log(job?.data, job?.name, job?.id);
        sampleJob.handle();
      } else if (job.name === "SubmissionJob") {
        const sampleJob = new SampleJob(job.data);
        console.log(job?.data, job?.name, job?.id);
        sampleJob.handle();
      }
      return true;
    },
    { connection: redisConnection }
  );
}
