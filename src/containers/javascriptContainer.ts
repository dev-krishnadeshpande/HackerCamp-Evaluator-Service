import { DockerodeOptions } from "../types/dockerodeOptions";
import { createContainer, getDecodedStream } from "./containerHelper";

async function runJavaScriptCode(jsCode: string) {
  const containerOptions: DockerodeOptions = {
    Image: "node",
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    Cmd: ["node", "-e", jsCode],
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
    console.log("codeResponse", codeResponse);

    return { output: codeResponse, status: "COMPLETED" };
  } catch (error) {
    return { output: error as string, status: "ERROR" };
  } finally {
    await container.remove();
  }
}

export default runJavaScriptCode;
