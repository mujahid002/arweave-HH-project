// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721Enumerable, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {IERC721} from "@openzeppelin/contracts/interfaces/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

error Polyweave__InvalidAmount();
error Polyweave__InsufficientFunds();
error Polyweave__ContributionTooLow();
error Polyweave__UserCannotPerformAnyOperation();

contract Polyweave is ERC721Enumerable, Ownable, ReentrancyGuard {
    mapping(address => mapping(string => uint256)) private s_contributors;

    uint256 private s_tokenId;

    uint256 private s_minimumContributedValue = 10;

    uint256 private s_totalContributionAmount;

    event AmountDeposited(
        address indexed depositor,
        string indexed arAccount,
        uint256 indexed depositedAmount
    );

    constructor() ERC721("Polyweave", "POAR") Ownable(msg.sender) {}

    function depositAmount(string calldata arAccount) public payable {
        if (msg.value <= 0) revert Polyweave__InvalidAmount();
        s_contributors[msg.sender][arAccount] += msg.value;
        emit AmountDeposited(msg.sender, arAccount, msg.value);
    }

    function withdrawAmount(
        address userAddress,
        string calldata arAccount,
        uint256 amount
    ) public nonReentrant onlyOwner {
        if (amount <= 0) revert Polyweave__InvalidAmount();
        uint256 userAmount = s_contributors[userAddress][arAccount];

        if (userAmount < amount) revert Polyweave__InsufficientFunds();

        if (userAmount == amount) {
            delete s_contributors[userAddress][arAccount];
        } else {
            s_contributors[userAddress][arAccount] -= amount;
        }

        (bool success, ) = payable(userAddress).call{value: amount}("");
        if (!success) revert Polyweave__InvalidAmount();
    }

    function contributeAmount(
        address userAddress,
        string calldata arAccount,
        uint256 amount
    ) public nonReentrant onlyOwner {
        uint256 userAmount = s_contributors[userAddress][arAccount];
        if (userAmount < amount) revert Polyweave__InsufficientFunds();
        if (amount < s_minimumContributedValue)
            revert Polyweave__ContributionTooLow();

        uint256 tokenId = getTokenId();
        s_tokenId += 1;
        s_totalContributionAmount += amount;
        if (userAmount == amount) {
            delete s_contributors[userAddress][arAccount];
        } else {
            s_contributors[userAddress][arAccount] -= amount;
        }

        _mint(userAddress, tokenId);
    }

    function _safeTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) internal virtual override {
        revert Polyweave__UserCannotPerformAnyOperation();
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override(ERC721, IERC721) {
        revert Polyweave__UserCannotPerformAnyOperation();
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(ERC721, IERC721) {
        revert Polyweave__UserCannotPerformAnyOperation();
    }

    function setContributionValue(uint256 newValue) public onlyOwner {
        s_minimumContributedValue = newValue;
    }

    function getContributors(address callerAddress, string calldata arAccount)
        public
        view
        returns (uint256)
    {
        return s_contributors[callerAddress][arAccount];
    }

    function getContributionValue() public view returns (uint256) {
        return s_minimumContributedValue;
    }

    function getTokenId() public view returns (uint256) {
        return s_tokenId;
    }

    function getTotalContributionAmouny() public view returns (uint256) {
        return s_totalContributionAmount;
    }

    /*****************************
        DEVELOPMENT FUNCTIONS
    ******************************/
    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
