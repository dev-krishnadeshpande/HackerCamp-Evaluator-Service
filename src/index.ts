import express, { Express } from "express";

import serverAdapter from "./config/bullboardConfig";
import serverConfig from "./config/serverConfig";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import SampleWorker from "./worker/sampleWorker";

const app: Express = express();

app.use("/api", apiRouter);
app.use("/admin/queues", serverAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  SampleWorker("SampleQueue");

  sampleQueueProducer("SampleJob", {
    name: "Krishna",
    Org: "Acc",
    Position: "SSE",
  });

  console.log(`Server started at *:${serverConfig.PORT}`);
});
