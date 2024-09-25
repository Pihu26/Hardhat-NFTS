const pinataSDK = require("@pinata/sdk");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const apiKey = process.env.PINATA_API_KEY;
const sceretKey = process.env.PINATA_SECRET_KEY;
const pinata = new pinataSDK(apiKey, sceretKey);

async function storeImages(imageToFilePath) {
  const fullFilePath = path.resolve(imageToFilePath);
  const files = fs.readdirSync(fullFilePath);
  console.log(files);
  let responses = [];
  console.log("uploading to pinata ......");
  for (fileIndex in files) {
    console.log(`working on it ${fileIndex}...`);
    const readEveryFile = fs.createReadStream(
      `${fullFilePath}/${files[fileIndex]}`
    );
    try {
      const response = await pinata.pinFileToIPFS(readEveryFile);
      responses.push(response);
    } catch (error) {
      console.log(error);
    }
  }
  return { files, responses };
}

async function storeImageMetaData(metaData) {
  try {
    const storeImage = await pinata.pinJSONToIPFS(metaData);
    return storeImage;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { storeImages, storeImageMetaData };
