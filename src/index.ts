import express, { Express } from "express";

import serverAdapter from "./config/bullboardConfig";
import serverConfig from "./config/serverConfig";
import runJavaScriptCode from "./containers/javascriptContainer";
// import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
// import SampleWorker from "./worker/sampleWorker";

const app: Express = express();

app.use("/api", apiRouter);
app.use("/admin/queues", serverAdapter.getRouter());

app.listen(serverConfig.PORT, async () => {
  // SampleWorker("SampleQueue");

  // sampleQueueProducer("SampleJob", {
  //   name: "Krishna",
  //   Org: "Acc",
  //   Position: "SSE",
  // });

  const jsCode = `console.log(1 + 1)`;
  const output = await runJavaScriptCode(jsCode);
  console.log(`Output from container:${output.output}`);

  console.log(`Server started at *:${serverConfig.PORT}`);
});
