import { runExecution } from "@/lib/run-execution";
import { makeOnChainProposalId } from "@/lib/utils";
import { procedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { z } from "zod";

export const launchExecution = procedure
  .input(
    z.object({
      proposal: z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
      }),
      treasury: z.object({
        address: z.string(),
      }),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const treasury = await db.treasury.findUniqueOrThrow({
      where: { address: input.treasury.address },
    });

    const execution = await db.execution.create({
      data: {
        onChainProposalId: makeOnChainProposalId({
          chainId: 1,
          proposalId: input.proposal.id,
        }),
        title: input.proposal.title,
        description: input.proposal.description,
        treasuryId: treasury.id,
      },
    });

    runExecution(execution.id).catch((error) => {
      console.error(error);
    });
  });
