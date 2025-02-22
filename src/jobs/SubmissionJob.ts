import { Job } from "bullmq";

import cppExecutor from "../containers/cppExecutor";
import javascriptExecutor from "../containers/javascriptExecutor";
import evaluationQueueProducer from "../producers/evaluationQueueProducer";
import { IJob } from "../types/bullMqJobDefinition";
import {
  CODE_LANGUAGE_CPP,
  CODE_LANGUAGE_JAVASCRIPT,
} from "../utils/constants";
import formatInputTestcaseString from "../utils/formatInputTestcaseString";

export default class SubmissionJob implements IJob {
  name: string;
  payload?: Record<string, unknown>;

  constructor(payload: Record<string, unknown>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handle = async () => {
    if (this.payload) {
      const key = Object.keys(this.payload)[0];
      const {
        submissionId,
        userId,
        language: codeLanguage,
        code,
        testCases,
      } = this.payload[key] as {
        submissionId: string;
        userId: string;
        language: string;
        code: string;
        testCases: { testCaseId: string; input: string; output: string }[];
      };

      //Test cases
      const responses = testCases.map(
        async (testCase: {
          testCaseId: string;
          input: string;
          output: string;
        }) => {
          const testCaseId = testCase.testCaseId;
          const inputTestCase = testCase.input;
          const outputTestCase = testCase.output;
          const formattedInputTestCase =
            formatInputTestcaseString(inputTestCase);

          if (
            codeLanguage?.toLowerCase() ===
            CODE_LANGUAGE_JAVASCRIPT.toLowerCase()
          ) {
            return javascriptExecutor(
              code as string,
              testCaseId,
              formattedInputTestCase,
              outputTestCase
            );
          } else if (
            codeLanguage?.toLowerCase() === CODE_LANGUAGE_CPP.toLowerCase()
          ) {
            //TODO: Add changes for cppExecutor
            return await cppExecutor(
              code as string,
              formattedInputTestCase,
              outputTestCase
            );
          }
        }
      );
      const responsesArr = await Promise.all(responses);
      console.log(responsesArr);

      evaluationQueueProducer({ response: responsesArr, submissionId, userId });
    }
  };

  failed = (job?: Job) => {
    console.error("Job failed, Id: ", job?.id);
  };
}
