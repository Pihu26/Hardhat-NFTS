const { ethers, network } = require("hardhat");
const {
  developmentChains,
  initial_Answer,
  decimals,
} = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const BASE_FEE = "1000000000000000"; // 0.001 ether as base fee
  const GAS_PRICE = "50000000000"; // 50 gwei
  const WEI_PER_UNIT_LINK = "10000000000000000"; // 0.01 ether per LINK

  const arguments = [BASE_FEE, GAS_PRICE, WEI_PER_UNIT_LINK];

  if (developmentChains.includes(network.name)) {
    log("local network dected-------");
    await deploy("VRFCoordinatorV2_5Mock", {
      from: deployer,
      args: arguments,
      log: true,
    });

    await deploy("MockV3Aggregator", {
      from: deployer,
      args: [decimals, initial_Answer],
      log: true,
    });
  }

  log("deployed.....");
};

module.exports.tags = ["all", "mocks"];
