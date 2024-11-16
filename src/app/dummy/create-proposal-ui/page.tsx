"use client";

import { DUMMY_DAO_VIEW_UI_PROPS } from "@/app/dummy/dao-view-ui/page";
import { CreateProposalUi } from "@/components/create-proposal-ui";
import { DaoViewUi } from "@/components/dao-view-ui/dao-view-ui";

export default function TestProposalDetailsPage() {
  return (
    <DaoViewUi {...DUMMY_DAO_VIEW_UI_PROPS}>
      <CreateProposalUi
        OnSubmitProposal={() => {
          console.log("Submitted Proposal");
        }}
      />
    </DaoViewUi>
  );
}
