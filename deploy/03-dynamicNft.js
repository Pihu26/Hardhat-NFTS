const { network, ethers } = require("hardhat");
const fs = require("fs");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy } = await deployments;

  const chainId = network.config.chainId;
  let addressAggregator;
  if (developmentChains.includes(network.name)) {
    const aggregatorV3 = await ethers.getContract("MockV3Aggregator");
    addressAggregator = aggregatorV3.address;
  } else {
    addressAggregator = networkConfig[chainId]["ethusdPrice"];
  }

  const high = "./images/dynamicNft/happy.svg";
  const low = "./images/dynamicNft/frown.svg";

  const highSvg = fs.readFileSync(high, {
    encoding: "utf8",
  });
  const lowSvg = fs.readFileSync(low, {
    encoding: "utf8",
  });
  arguments = [addressAggregator, lowSvg, highSvg];

  console.log("-----------------------------------");
  const dynamicNft = await deploy("DynamicSvgNft", {
    from: deployer,
    args: arguments,
    log: true,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEYS
  ) {
    await verify(dynamicNft.address, arguments);
  }

  console.log("deployed----");
};

module.exports.tags = ["all", "dynamicnft", "mains"];
