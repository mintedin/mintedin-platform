// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFreelancerNFT {
    struct Job {
        uint256 jobId;
        uint256 rating;
    }
    struct Freelancer {
        uint256 revenue;
        uint256 jobAcceptedCount;
        uint256 jobCompletedCount;
    }

    function tokenIdOf(address owner) external view returns (uint256);
}
