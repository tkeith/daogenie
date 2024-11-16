"use client";

import { DaoSelect } from "@/components/dao-select";
import { DaoSelectUi } from "@/components/dao-select-ui";
import { useState } from "react";

export default function Home() {
  const [selectedDaoId, setSelectedDaoId] = useState<number | null>(null);

  if (selectedDaoId === null) {
    return <DaoSelect onSelect={setSelectedDaoId} />;
  }

  return <main></main>;
}
