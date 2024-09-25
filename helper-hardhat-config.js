const networkConfig = {
  31337: {
    name: "localhost",
    keyHash:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callbackGasLimit: "500000",
    mintFee: "10000000000000000",
  },
  11155111: {
    name: "sepolia",
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    subscriptionId:
      "111573491681206741110796135053056066002501003447431212922826476593299876159752",
    keyHash:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callbackGasLimit: "500000",
    mintFee: "10000000000000000", //0.01 eth
    ethusdPrice: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
};
const developmentChains = ["hardhat", "localhost"];

const decimals = 8;
const initial_Answer = 200000000000;

module.exports = {
  developmentChains,
  networkConfig,
  decimals,
  initial_Answer,
};
