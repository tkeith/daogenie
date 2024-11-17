"use client";

import { DUMMY_DAO_VIEW_UI_PROPS } from "@/app/dummy/dao-view-ui/page";
import { DaoViewUi } from "@/components/dao-view-ui/dao-view-ui";
import { ProposalDetailsUi } from "@/components/proposal-details-ui";

export default function TestProposalDetailsPage() {
  return (
    <DaoViewUi {...DUMMY_DAO_VIEW_UI_PROPS}>
      <ProposalDetailsUi
        currentVotes={500}
        votesRequired={1000}
        votedStatus={false}
        onSelectedYes={() => {
          console.log("Voted Yes");
        }}
        onSelectedNo={() => {
          console.log("Voted No");
        }}
        proposal={{
          id: 1,
          title: "First Proposal",
          status: "Voting",
          description: "This is the description of the first proposal",
          votesReceived: 500,
          createdAt: "2021-01-01 12:00:00",
          creatorWalletAddress: "0x1234567890abcdef",
        }}
      />
    </DaoViewUi>
  );
}
