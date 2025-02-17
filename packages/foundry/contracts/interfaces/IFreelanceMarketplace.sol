// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IFreelanceMarketplace {
    // Job Status Enum
    enum JobStatus {
        None, // Default value
        Created,
        Cancelled,
        Funded,
        Accepted,
        Submitted,
        Approved,
        Completed,
        Disputed,
        Resolved
    }

    // Contract global variables
    struct Global {
        address freelanceNFT;
        address clientNFT;
        uint256 jobCount;
        uint256 platformFee;
        uint256 totalPlatformFees;
    }

    // Job Structure
    struct Job {
        uint256 id;
        address client;
        address freelancer;
        uint256 escrowAmount;
        JobStatus status;
        uint256 feedback; // Simple rating or feedback score
    }

    // Events
    event JobCreated(uint256 indexed jobId, address indexed client);
    event JobCancelled(uint256 indexed jobId);
    event JobFunded(uint256 indexed jobId, uint256 amount);
    event OfferAccepted(uint256 indexed jobId, address indexed freelancer);
    event WorkSubmitted(uint256 indexed jobId);
    event WorkApproved(uint256 indexed jobId);
    event JobCompleted(uint256 indexed jobId);
    event JobDisputed(uint256 indexed jobId);
    event DisputeResolved(uint256 indexed jobId);
    event PaymentReleased(
        uint256 indexed jobId,
        uint256 amount,
        address recipient
    );
    event PaymentWithdrawn(
        uint256 indexed jobId,
        uint256 amount,
        address recipient
    );
    event FeedbackLeft(uint256 indexed jobId, uint256 feedback);
    event FreelancerReputationUpdated(address freelancer, uint256 pointsDelta);
    event PlatformFeeSet(uint256 newFee);
    event PlatformFeesWithdrawn(uint256 amount, address recipient);
}
