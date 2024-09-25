# NFT Collection with Hardhat

This project showcases the deployment of three types of NFTs using Hardhat on the Ethereum blockchain:
- **Dynamic SVG NFT**: NFTs whose images are rendered dynamically based on data.
- **Random IPFS NFT**: NFTs that use Chainlink VRF for randomization and store images on IPFS.
- **Basic NFT**: Standard ERC721 tokens with static metadata.

## Project Overview

### 1. Dynamic SVG NFT
- **Description**: This NFT dynamically generates an SVG image based on on-chain data. The SVG changes based on conditions such as token ownership or other triggers.
- **Technology Used**: Solidity, Hardhat,OpenZeppelin
- **Features**:
  - Dynamically generated SVG on-chain.
  - Adjustable features based on specific conditions.

Here is the link for Sepolia OpenSea:https://testnets.opensea.io/collection/dynamic-svg-nft-251
Here is the Contract Verfication : https://sepolia.etherscan.io/address/0xb8C56b1a6814dCaAc0df4299CB940f9e46f7714b#code

### 2. Random IPFS NFT
- **Description**: Uses Chainlink VRF to generate random numbers, assigning unique metadata and images stored on IPFS.
- **Technology Used**: Solidity, Hardhat, Chainlink VRF, IPFS, OpenZeppelin
- **Features**:
  - Integration with Chainlink VRF for randomness.
  - IPFS used for decentralized storage of images.
  - Unique metadata linked to random numbers.
    
Here is the Random Ipfs Verification code:https://sepolia.etherscan.io/address/0xC3A93EEb8612B49D9A0D396a9D50568de50578cb#code
Here is Uploaded to Pinata MetaData : https://moccasin-occupational-warbler-939.mypinata.cloud/ipfs/QmRVCfDzF5idtLC43aY5fxUCxrsBGPJQVXyxDAgfuF6kpc
                                     https://moccasin-occupational-warbler-939.mypinata.cloud/ipfs/Qmaz9inET5724cfLiNnyhq2K46SMPhD2y5grV3RLPXwgVA
                                    https://moccasin-occupational-warbler-939.mypinata.cloud/ipfs/QmUL7p6JAa9JB1sNY2q5w5QR5qpFKniFMBJ7iCToWd5rAM

### 3. Basic NFT
- **Description**: A basic ERC721 token implementation that represents a simple NFT with static metadata.
- **Technology Used**: Solidity, Hardhat, OpenZeppelin
- **Features**:
  - Standard ERC721 implementation.
  - Static metadata that can be fetched from IPFS or another source.
 
  Here is the TokenUri forSimple one :   "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
