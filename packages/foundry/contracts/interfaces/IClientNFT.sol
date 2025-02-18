// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IClientNFT {
    struct Job {
        uint256 jobId;
        uint256 rating;
    }
    struct Client {
        uint256 revenue;
        uint256 jobCreatedCount;
        uint256 jobCompletedCount;
    }

    function tokenIdOf(address owner) external view returns (uint256);
}
