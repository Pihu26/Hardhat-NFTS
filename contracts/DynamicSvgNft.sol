// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract DynamicSvgNft is ERC721 {
    uint256 private s_tokenCounter;
    string private s_highImageURI;
    string private s_lowImageURI;
    string private constant SVGIMAGEPREFIX = "data:image/svg+xml;base64,";
    AggregatorV3Interface internal immutable i_priceFeed;

    mapping(uint256 => int256) public s_tokenIdToHighValue;

    event CreatedNft(uint256 indexed tokenId, int256 highValue);

    constructor(
        address priceFeedAddress,
        string memory lowSvg,
        string memory highSvg
    ) ERC721("Dynamic Svg Nft", "DSN") {
        s_tokenCounter = 0;
        s_lowImageURI = svgToImage(lowSvg);
        s_highImageURI = svgToImage(highSvg);
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function svgToImage(string memory svg) public pure returns (string memory) {
        string memory base64EncodedSvg = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );
        return string(abi.encodePacked(SVGIMAGEPREFIX, base64EncodedSvg));
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function mintNft(int256 highValue) public {
        uint256 newTokenId = s_tokenCounter;
        s_tokenIdToHighValue[s_tokenCounter] = highValue;
        _safeMint(msg.sender, newTokenId);
        s_tokenCounter += s_tokenCounter;
        emit CreatedNft(newTokenId, highValue);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireMinted(tokenId);
        (, int256 answer, , , ) = i_priceFeed.latestRoundData();
        string memory imageURI = s_lowImageURI;
        if (answer >= s_tokenIdToHighValue[tokenId]) {
            imageURI = s_highImageURI;
        }
        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name(),
                                '" ,"description":"An nft based on chainlink price",',
                                '"attribute":[{"type_trairs":"coolness","value":100}],"image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function getLowSvg() public view returns (string memory) {
        return s_lowImageURI;
    }

    function getHighSvg() public view returns (string memory) {
        return s_highImageURI;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }

    function gettokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
