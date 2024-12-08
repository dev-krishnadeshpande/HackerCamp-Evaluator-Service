import Dockerode from "dockerode";
import tar from "tar-stream";

import { DockerodeOptions } from "../types/dockerodeOptions";
import { createContainer, getDecodedStream } from "./containerHelper";

async function runCppCode(cppCode: string) {
  const containerOptions: DockerodeOptions = {
    Image: "gcc",
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    Cmd: ["tail", "-f", "/dev/null"],
    WorkingDir: "/workspace",
  };

  const container = await createContainer(containerOptions);

  await container.start();

  // Push the C++ code into the container
  // await pushCppCodeToContainer(container, cppCode);

  // Verify container is running
  const containerInfo = await container.inspect();
  if (!containerInfo.State.Running) {
    console.error("Container is not running.");
    return;
  }

  // Create the directory in the container
  const exec = await container.exec({
    Cmd: ["mkdir", "-p", "/workspace"],
    AttachStdout: true,
    AttachStderr: true,
  });

  await exec.start({}); // Provide required options
  console.log("Directory created in container!");

  // Push the C++ code into the container
  await pushCppCodeToContainer(container, cppCode);

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
    // await container.remove();
  }
}

async function pushCppCodeToContainer(
  container: Dockerode.Container,
  cppCode: string
) {
  const pack = tar.pack(); // Create a tar archive in memory

  // Add program.cpp with the provided C++ code
  pack.entry({ name: "program.cpp" }, cppCode);
  pack.finalize();

  // // Ensure /workspace directory exists
  // const exec = await container.exec({
  //   Cmd: ["mkdir", "-p", "/workspace"],
  //   AttachStdout: true,
  //   AttachStderr: true,
  // });

  // const stream = await exec.start({ hijack: true, stdin: false }); // Provide required options
  // console.log(stream);

  // Push the archive to the container's working directory
  await container.putArchive(pack, { path: "/workspace" });

  // Step 3: Compile the C++ code
  const compileExec = await container.exec({
    Cmd: ["g++", "-o", "/workspace/program", "/workspace/program.cpp"],
    AttachStdout: true,
    AttachStderr: true,
  });

  const compileStream = await compileExec.start({});
  compileStream.pipe(process.stdout);
  console.log("C++ code compiled.");

  // Step 4: Run the compiled program
  const runExec = await container.exec({
    Cmd: ["/workspace/program"],
    AttachStdout: true,
    AttachStderr: true,
  });

  const runStream = await runExec.start({});
  runStream.pipe(process.stdout);
  console.log("C++ program executed.");
}

export default runCppCode;
