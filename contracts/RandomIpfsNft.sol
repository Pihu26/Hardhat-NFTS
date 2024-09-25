// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

error RandomIpfsNft__RangeOutOfBound();
error RandomIpfsNft__NeedMoreEth();
error RandomIpfsNft__TransferFail();

contract RandomIpfsNft is VRFConsumerBaseV2Plus, ERC721URIStorage {
    enum Breed {
        PUG,
        SHIBA_INU,
        ST_BRENAND
    }

    bytes32 private immutable i_keyHash;
    uint256 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    mapping(uint256 => address) public s_requestIdToSender;

    uint256 public s_tokenCounter;
    uint256 private constant MAX_CHANCE_VALUE = 100;
    string[] internal s_dogTokenUris;
    uint256 internal immutable i_mintFee;

    event nftRequested(uint256 indexed requestId, address indexed requester);
    event nftMinted(
        uint256 indexed tokenId,
        Breed indexed breeds,
        address indexed minter
    );

    constructor(
        address vrfCoordinator,
        bytes32 keyHash,
        uint256 subscriptionId,
        uint32 callbackGasLimit,
        string[3] memory dogTokenUris,
        uint256 mintFee
    ) VRFConsumerBaseV2Plus(vrfCoordinator) ERC721("Random Ipfs Nft", "NIT") {
        i_keyHash = keyHash;
        i_callbackGasLimit = callbackGasLimit;
        i_subscriptionId = subscriptionId;
        s_dogTokenUris = dogTokenUris;
        i_mintFee = mintFee;
    }

    function requestNft() public payable returns (uint256 requestId) {
        if (msg.value < i_mintFee) {
            revert RandomIpfsNft__NeedMoreEth();
        }
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: i_keyHash,
                subId: i_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: i_callbackGasLimit,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
        s_requestIdToSender[requestId] = msg.sender;
        emit nftRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        address nftDogOwner = s_requestIdToSender[requestId];
        uint256 newToken = s_tokenCounter;
        s_tokenCounter += s_tokenCounter;
        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        Breed dogBreed = getBreedModRng(moddedRng);
        _safeMint(nftDogOwner, newToken);
        _setTokenURI(newToken, s_dogTokenUris[uint256(dogBreed)]);
        emit nftMinted(newToken, dogBreed, nftDogOwner);
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert RandomIpfsNft__TransferFail();
        }
    }

    function getBreedModRng(uint256 moddedRng) public pure returns (Breed) {
        uint256 cumulative = 0;
        uint256[3] memory chanceArray = getChangeBreed();
        // moddedRng=55

        for (uint256 i = 0; i < chanceArray.length; i++) {
            if (
                moddedRng >= cumulative &&
                moddedRng < cumulative + chanceArray[i]
            ) {
                return Breed(i);
            }
            cumulative += chanceArray[i];
        }
        revert RandomIpfsNft__RangeOutOfBound();
    }

    function getChangeBreed() public pure returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE_VALUE];
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getDogTokenURI(uint256 index) public view returns (string memory) {
        return s_dogTokenUris[index];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
