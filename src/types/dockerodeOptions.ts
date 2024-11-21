export interface DockerodeOptions {
  Image: string;
  AttachStdin?: boolean;
  AttachStdout?: boolean;
  AttachStderr?: boolean;
  Tty: boolean;
  Cmd: string[];
}
