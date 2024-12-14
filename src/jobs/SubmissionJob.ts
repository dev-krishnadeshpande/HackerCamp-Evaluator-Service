import { Job } from "bullmq";

import runCppCode from "../containers/cppContainer";
import runJavaScriptCode from "../containers/javascriptContainer";
import { IJob } from "../types/bullMqJobDefinition";
import {
  CODE_LANGUAGE_CPP,
  CODE_LANGUAGE_JAVASCRIPT,
} from "../utils/constants";

export default class SubmissionJob implements IJob {
  name: string;
  payload?: Record<string, unknown>;

  constructor(payload: Record<string, unknown>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handle = async () => {
    const language = this.payload?.language;
    if (language === CODE_LANGUAGE_JAVASCRIPT) {
      const code = this.payload?.code;
      const response = await runJavaScriptCode(code as string);
      console.log("response", response);
    } else if (language === CODE_LANGUAGE_CPP) {
      const code = this.payload?.code;
      const response = await runCppCode(code as string);
      console.log("response", response);
    }
  };

  failed = (job?: Job) => {
    console.log("Job failed, Id: ", job?.id);
  };
}
