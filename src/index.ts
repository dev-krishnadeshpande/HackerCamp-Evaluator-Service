import express, { Express } from "express";

import serverAdapter from "./config/bullboardConfig";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import { SUBMISSION_QUEUE } from "./utils/constants";
import SubmissionWorker from "./worker/submissionWorker";

const app: Express = express();

app.use("/api", apiRouter);
app.use("/admin/queues", serverAdapter.getRouter());

app.listen(serverConfig.PORT, async () => {
  try {
    SubmissionWorker(SUBMISSION_QUEUE);

    console.log(`Server started at *: ${serverConfig.PORT}`);
  } catch (error) {
    console.error(error);
  }
});
