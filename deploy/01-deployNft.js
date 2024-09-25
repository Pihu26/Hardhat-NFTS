const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  log("------------------");

  const arguments = [];

  const bascicNft = await deploy("BasicNft", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEYS
  ) {
    log("verifying..");
    await verify(bascicNft.address, arguments);
  }
};

module.exports.tags = ["all", "basicNft", "main"];
