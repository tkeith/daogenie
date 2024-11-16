"use client";

import { DaoSelectUi } from "@/components/dao-select-ui";

export default function TestUiPage() {
  // Dummy data for testing
  const dummyDaos = [
    {
      name: "Test DAO 1",
      onSelect: () => {
        console.log("Selected Test DAO 1");
      },
    },
    {
      name: "Awesome DAO",
      onSelect: () => {
        console.log("Selected Awesome DAO");
      },
    },
    {
      name: "Community DAO",
      onSelect: () => {
        console.log("Selected Community DAO");
      },
    },
  ];

  // Handler for "Create New DAO" action
  const handleCreateDao = () => {
    console.log("Create new DAO clicked");
  };

  return <DaoSelectUi daos={dummyDaos} onSelectCreateDao={handleCreateDao} />;
}
