const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();

  //   BASICNFT
  const basicNft = await ethers.getContract("BasicNft", deployer);
  const basicMint = await basicNft.mintNft();
  await basicMint.wait(1);
  console.log(
    `This is an token Uri of 1st mint Nft ${await basicNft.tokenURI(0)}`
  );

  //   DYNAMICNFT
  const highValue = ethers.utils.parseEther("0.01");
  const dynamicNft = await ethers.getContract("DynamicSvgNft", deployer);
  const dynamicMint = await dynamicNft.mintNft(highValue);
  await dynamicMint.wait(1);
  console.log(`Dynamic nft minted at 0 is ${await dynamicNft.tokenURI(0)}`);

  //   RANDOMNFTS
  const randomNft = await ethers.getContract("RandomIpfsNft", deployer);
  const mintFee = await randomNft.getMintFee();

  await new Promise(async (resolve, reject) => {
    setTimeout(resolve, 300000);
    randomNft.once("nftMinted", async () => {
      console.log(
        `Random IPFS NFT index 0 tokenURI: ${await randomNft.tokenURI(0)}`
      );
      resolve();
    });
    const randomMint = await randomNft.requestNft({
      value: mintFee.toString(),
    });
    const randomIpfsNftMintTxReceipt = await randomMint.wait(1);

    if (developmentChains.includes(network.name)) {
      const requestId =
        randomIpfsNftMintTxReceipt.events[1].args.requestId.toString();
      const vrfCoordinatorV2Mock = await ethers.getContract(
        "VRFCoordinatorV2_5Mock",
        deployer
      );
      await vrfCoordinatorV2Mock.fulfillRandomWords(
        requestId,
        randomNft.address
      );
    }
  });
};

module.exports.tags = ["all", "mint"];
