import Docker from "dockerode";

import { DockerodeOptions } from "../types/dockerodeOptions";

const docker = new Docker();

export async function createContainer(options: DockerodeOptions) {
  const container = docker.createContainer(options);

  return container;
}
