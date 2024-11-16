// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI = 1_000_000_000n;

export default buildModule("DAOGenieModule", (m) => {
  const daoGenie = m.contract("DAOGenie", []);

  return { daoGenie };
});
