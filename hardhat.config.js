require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("dotenv").config();

const sepolia_PRIVATE_KEY = process.env.PRIVATE_KEY || "0xrinky";
const sepolia_RPC_URL = process.env.RPC_URL || "https/rinkeby";
const API_KEY = process.env.ETHERSCAN_API_KEYS || "key";
const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY || "key";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: sepolia_RPC_URL,
      accounts: [sepolia_PRIVATE_KEY],
      chainId: 11155111,
    },

    localHost: {
      url: " http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },

  etherscan: {
    apiKey: API_KEY,
  },

  solidity: { compilers: [{ version: "0.8.8" }, { version: "0.8.19" }] },

  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },

    mocha: {
      timeout: 200000, // 200 seconds max for running tests
    },
  },
};
