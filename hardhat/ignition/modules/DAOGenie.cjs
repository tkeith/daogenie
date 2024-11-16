// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DAOGenieModule", (m) => {
  const daoGenie = m.contract("DAOGenie", []);

  return { daoGenie };
});
