const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { storeImages, storeImageMetaData } = require("../utils/uploadToPinata");
const { verify } = require("../utils/verify");

const imagesPath = "./images/randomNfts";

const metaDataTemplates = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_types: "cuteness",
      value: 100,
    },
  ],
};

tokenUris = [
  "ipfs://QmRVCfDzF5idtLC43aY5fxUCxrsBGPJQVXyxDAgfuF6kpc",
  "ipfs://Qmaz9inET5724cfLiNnyhq2K46SMPhD2y5grV3RLPXwgVA",
  "ipfs://QmUL7p6JAa9JB1sNY2q5w5QR5qpFKniFMBJ7iCToWd5rAM",
];

const Amount = ethers.utils.parseEther("1");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (process.env.UPLOADTO_PINATA == "true") {
    tokenUris = await handleTokenUri();
  }

  let vrfCoordinatorV2Addres, subscriptionId, vrfCoordinatorV2;
  if (developmentChains.includes(network.name)) {
    console.log("getting the vrfcooradinator");
    vrfCoordinatorV2 = await ethers.getContract("VRFCoordinatorV2_5Mock");
    vrfCoordinatorV2Addres = vrfCoordinatorV2.address;
    const tx = await vrfCoordinatorV2.createSubscription();
    const txRecipt = await tx.wait();
    subscriptionId = txRecipt.events[0].args.subId;
    await vrfCoordinatorV2.fundSubscription(subscriptionId, Amount);
  } else {
    vrfCoordinatorV2Addres = networkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }

  const arguments = [
    vrfCoordinatorV2Addres,
    networkConfig[chainId]["keyHash"],
    subscriptionId,
    networkConfig[chainId]["callbackGasLimit"],
    tokenUris,
    networkConfig[chainId]["mintFee"],
  ];

  log("deploying radomipfsnfts ....");

  const randomIpfsNft = await deploy("RandomIpfsNft", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmation: network.config.blockConfirmations || 1,
  });

  if (developmentChains.includes(network.name)) {
    await vrfCoordinatorV2.addConsumer(subscriptionId, randomIpfsNft.address);
  }

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEYS
  ) {
    await verify(randomIpfsNft.address, arguments);
  }
};

async function handleTokenUri() {
  const tokenUris = [];
  const { responses: imageUploadResponses, files } = await storeImages(
    imagesPath
  );

  for (const imageUploadResponsesIndex in imageUploadResponses) {
    let tokenUrisMetaData = { ...metaDataTemplates };
    tokenUrisMetaData.name = files[imageUploadResponsesIndex].replace(
      ".png",
      ""
    );
    tokenUrisMetaData.description = `An adorable ${tokenUrisMetaData.name} pup!`;
    tokenUrisMetaData.image = `ipfs://${imageUploadResponses[imageUploadResponsesIndex].IpfsHash}`;
    console.log(`uploading ${tokenUrisMetaData.name}`);
    const metaDataUpload = await storeImageMetaData(tokenUrisMetaData);
    tokenUris.push(`ipfs://${metaDataUpload.IpfsHash}`);
  }
  console.log("uploading the metaData to pinata that are: ");
  console.log(tokenUris);
}
module.exports.tags = ["all", "randomNft", "main"];
