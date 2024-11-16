import { db } from "@/server/db";

export async function runExecution(executionId: number) {
  const execution = await db.execution.findUniqueOrThrow({
    where: { id: executionId },
  });

  throw new Error("Not implemented");
}
