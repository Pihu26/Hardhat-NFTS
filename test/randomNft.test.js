const { network, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("randomNft", function () {
      let deployer, randomNft, vrfCoordinator;
      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["mocks", "randomNft"]);
        randomNft = await ethers.getContract("RandomIpfsNft");
        vrfCoordinator = await ethers.getContract("VRFCoordinatorV2_5Mock");
      });
      describe("constructor", function () {
        it("set the strating properly", async () => {
          const doguri = await randomNft.getDogTokenURI(0);
          assert(doguri.includes("ipfs://"));
        });
      });

      describe("request Nft", function () {
        beforeEach(async () => {});
        it("request an nft", async () => {
          await expect(randomNft.requestNft()).to.be.revertedWith(
            "RandomIpfsNft__NeedMoreEth"
          );
        });
        it("emit an event for it", async () => {
          const mint = await randomNft.getMintFee();
          await expect(
            randomNft.requestNft({ value: mint.toString() })
          ).to.emit(randomNft, "nftRequested");
        });
      });
      describe("fullfillRandom words", function () {
        it("Mint nft after random number is return", async () => {
          await new Promise((resolve, reject) => {
            randomNft.once("nft minted", async () => {
              try {
                const counter = await randomNft.getTokenCounter();
                const dogUri = await randomNft.getDogTokenURI();
              } catch (error) {}
            });
          });
        });
      });
    });
