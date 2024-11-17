"use client";

import { DUMMY_DAO_VIEW_UI_PROPS } from "@/app/dummy/dao-view-ui/page";
import { DaoMainViewUi } from "@/components/dao-main-view-ui";
import { DaoViewUi } from "@/components/dao-view-ui/dao-view-ui";

export default function TestProposalDetailsPage() {
  return (
    <DaoViewUi {...DUMMY_DAO_VIEW_UI_PROPS}>
      <DaoMainViewUi
        name="First Dao"
        createdAt="2021-01-01 12:00:00"
        creatorWalletAddress="0x1234567890abcdef"
        daoWalletAddress="0x1234567890abcdef"
        members={[{ walletAddress: "0x1234567890abcdef", votes: 100 }]}
        balance={1000}
        totalVotes={1000}
        onUpdateMemberVotes={() => {
          console.log("Updated Member Votes");
        }}
      />
    </DaoViewUi>
  );
}
