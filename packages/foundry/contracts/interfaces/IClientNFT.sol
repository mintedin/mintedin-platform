// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IClientNFT {
    function tokenIdOf(address owner) external view returns (uint256);
}
