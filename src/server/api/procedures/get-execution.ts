import { procedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { z } from "zod";

export const getExecution = procedure
  .input(z.object({ onChainProposalId: z.string() }))
  .query(async ({ input }) => {
    const execution = await db.execution.findUniqueOrThrow({
      where: { onChainProposalId: input.onChainProposalId },
    });

    return {
      createdAt: execution.createdAt,
      title: execution.title,
      description: execution.description,
      status: execution.status,
      result: execution.result,
      error: execution.error,
    };
  });
