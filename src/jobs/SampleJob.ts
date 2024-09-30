import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefinition";

export default class SampleJob implements IJob {
  name: string;
  payload?: Record<string, unknown>;

  constructor(payload: Record<string, unknown>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handle = () => {
    console.log("hanlder");
    console.log(this.payload);
  };

  failed = (job?: Job) => {
    console.log("failed handler", job?.id);
  };
}
