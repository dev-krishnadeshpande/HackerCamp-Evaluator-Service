import express, { Express } from "express";

import serverAdapter from "./config/bullboardConfig";
import apiRouter from "./routes";
import SampleWorker from "./worker/sampleWorker";

const app: Express = express();

app.use("/api", apiRouter);
app.use("/admin/queues", serverAdapter.getRouter());

app.listen(4040, async () => {
  try {
    SampleWorker("SubmissionQueue");

    console.log(`Server started at *:4040`);
  } catch (error) {
    console.log(error);
  }
  // Test js code
  // const jsCode = `console.log(1 + 1)`;
  // const output = await runJavaScriptCode(jsCode);
  // console.log(`Output from container:${output.output}`);

  // Test cpp code
  // const cppCode = `
  //   #include <iostream>
  //   int main() {
  //       std::cout << "Hello, C++ World!" << std::endl;
  //       return 0;
  //   }`;

  // const output = await runCppCode(cppCode);
  // console.log("output", output);

  // console.log(`Output from container:${output.output}`);
});
