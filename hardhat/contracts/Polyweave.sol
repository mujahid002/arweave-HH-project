// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721Enumerable, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {IERC721} from "@openzeppelin/contracts/interfaces/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error Polyweave__InvalidAmount();
error Polyweave__InsufficientFunds();
error Polyweave__ContributionTooLow();
error Polyweave__UserCannotPerformAnyOperation();

contract Polyweave is ERC721Enumerable, Ownable, ReentrancyGuard {
    mapping(address => mapping(string => uint256)) public s_contributors;

    uint256 private s_tokenId;

    uint256 private s_minimumContributedValue = 10;

    event AmountDeposited(
        address indexed depositor,
        string indexed arAccount,
        uint256 indexed depositedAmount
    );

    constructor() ERC721("Polyweave", "POAR") Ownable(msg.sender) {}

    function depositAmount(string calldata arAccount) external payable {
        if (msg.value <= 0) revert Polyweave__InvalidAmount();
        s_contributors[msg.sender][arAccount] += msg.value;
        emit AmountDeposited(msg.sender, arAccount, msg.value);
    }

    function withdrawAmount(string calldata arAccount, uint256 amount)
        external
        nonReentrant
    {
        if (amount <= 0) revert Polyweave__InvalidAmount();
        if (s_contributors[msg.sender][arAccount] < amount)
            revert Polyweave__InsufficientFunds();

        s_contributors[msg.sender][arAccount] -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert Polyweave__InvalidAmount();
    }

    function contribute(string calldata arAccount, uint256 amount)
        external
        nonReentrant
    {
        if (s_contributors[msg.sender][arAccount] < amount)
            revert Polyweave__InsufficientFunds();
        if (amount < s_minimumContributedValue)
            revert Polyweave__ContributionTooLow();

        uint256 tokenId = s_tokenId;
        s_tokenId += 1;
        s_contributors[msg.sender][arAccount] -= amount;

        _mint(msg.sender, tokenId);
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

    function setContributionValue(uint256 newValue) external onlyOwner {
        s_minimumContributedValue = newValue;
    }

    function getContributionValue() external view returns (uint256) {
        return s_minimumContributedValue;
    }

    function getTokenId() external view returns (uint256) {
        return s_tokenId;
    }
}
