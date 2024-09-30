import sampleQueue from "../queue/sampleQueue";

export default async function (name: string, payload: Record<string, unknown>) {
  await sampleQueue.add(name, payload);
}
