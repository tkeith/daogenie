import { db } from "@/server/db";
import { runExecution } from "@/lib/run-execution";
import { ExecutionStatus } from "@prisma/client";

const ON_CHAIN_PROPOSAL_ID =
  "99999-" + Math.floor(Date.now() / 1000).toString();
const PROPOSAL_TITLE = "Test Proposal";
const PROPOSAL_DESCRIPTION = "This is a test proposal";
const TREASURY_ADDRESS = "0x79940Eb5606CA12487B4C1d513be6354f5169DD8";

async function main() {
  // Ensure the treasury exists
  const treasury = await db.treasury.findUniqueOrThrow({
    where: { address: TREASURY_ADDRESS },
  });

  // Create the execution
  const execution = await db.execution.create({
    data: {
      onChainProposalId: ON_CHAIN_PROPOSAL_ID,
      title: PROPOSAL_TITLE,
      description: PROPOSAL_DESCRIPTION,
      treasuryId: treasury.id,
    },
  });

  console.log("Created execution:", execution);

  // Run the execution
  runExecution(execution.id).catch((error) => {
    console.error(error);
  });

  // Wait for the execution to complete
  while (true) {
    const currentExecution = await db.execution.findUniqueOrThrow({
      where: { onChainProposalId: ON_CHAIN_PROPOSAL_ID },
    });

    if (currentExecution.status !== ExecutionStatus.RUNNING) {
      console.log(
        "Final execution state:",
        JSON.stringify(
          {
            status: currentExecution.status,
            result: currentExecution.result,
            error: currentExecution.error,
          },
          null,
          2,
        ),
      );
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
