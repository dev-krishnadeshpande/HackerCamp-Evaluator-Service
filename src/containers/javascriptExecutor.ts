import { DockerodeOptions } from "../types/dockerodeOptions";
import { createContainer, getDecodedStream } from "./containerHelper";

async function javascriptExecutor(
  code: string,
  testCaseId: string,
  inputTestCase: string,
  outputTestCase: string
) {
  const runCommand = `echo "${code}" > test.js && echo "${inputTestCase}" > input.txt && cat input.txt | node test.js`;

  const containerOptions: DockerodeOptions = {
    Image: "node",
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    Cmd: ["/bin/bash", "-c", runCommand],
  };

  const container = await createContainer(containerOptions);

  await container.start();

  // Attach to the container's output
  const logStream = await container.logs({
    follow: true,
    stdout: true,
    stderr: true,
  });

  try {
    const codeResponse: string = await getDecodedStream(logStream);
    return {
      testCaseId,
      output: codeResponse,
      status: "COMPLETED",
      expectedOutput: outputTestCase,
    };
  } catch (error) {
    return { output: error as string, status: "ERROR" };
  } finally {
    await container.remove();
  }
}

export default javascriptExecutor;
