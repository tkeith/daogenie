import { runExecution } from "@/lib/run-execution";
import { makeOnChainProposalId } from "@/lib/utils";
import { procedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { z } from "zod";

export const launchExecution = procedure
  .input(
    z.object({
      onChainProposalId: z.string(),
      proposalTitle: z.string(),
      proposalDescription: z.string(),
      treasuryAddress: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const treasury = await db.treasury.findUniqueOrThrow({
      where: { address: input.treasuryAddress },
    });

    const execution = await db.execution.create({
      data: {
        onChainProposalId: input.onChainProposalId,
        title: input.proposalTitle,
        description: input.proposalDescription,
        treasuryId: treasury.id,
      },
    });

    runExecution(execution.id).catch((error) => {
      console.error(error);
    });
  });
