const { network, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { assert } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic nft test", function () {
      let contract;
      beforeEach(async () => {
        const { deployer } = getNamedAccounts();
        await deployments.fixture(["basicNft"]);
        contract = await ethers.getContract("BasicNft");
      });

      describe("constructor", function () {
        it("properly asgin name and token Id", async () => {
          const name = await contract.name();
          const symbol = await contract.symbol();
          const counter = await contract.getTokenCounter();

          assert.equal(name, "Dogie");
          assert.equal(symbol, "DOG");
          assert.equal(counter.toString(), "0");
        });
      });

      describe("mint nft", () => {
        beforeEach(async () => {
          const nft = await contract.mintNft();
          await nft.wait(1);
        });
        it("counter variable increase by one and allow to mint nfts ", async () => {
          const token = await contract.getTokenCounter();
          const tokenUri = await contract.tokenURI(0);
          assert.equal(token.toString(), "1");
          assert.equal(tokenUri, await contract.TOKEN_URI());
        });
      });
    });
