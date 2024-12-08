/* eslint-disable @typescript-eslint/no-var-requires */
const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");

import submissionQueue from "../queues/submissionQueue";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(submissionQueue)],
  serverAdapter: serverAdapter,
});

export default serverAdapter;
