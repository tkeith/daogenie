"use client";

import { CreateDaoUi } from "@/components/create-dao-ui";

export default function TestProposalDetailsPage() {
  return (
    <CreateDaoUi
      onSubmit={() => {
        console.log("create a new dao");
      }}
      onCancel={() => {
        console.log("cancel");
      }}
    />
  );
}
