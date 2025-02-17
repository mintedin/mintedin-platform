// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {IFreelanceMarketplace} from "./interfaces/IFreelanceMarketplace.sol";

contract FreelanceMarketplace is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    IFreelanceMarketplace
{
    // Roles
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant MARKETPLACE_ADMIN = keccak256("MARKETPLACE_ADMIN");

    // Contract global state variables

    // Job specific state variables
    // State Variables
    uint256 public jobCounter;
    uint256 public platformFee; // In basis points, e.g. 100 = 1%
    uint256 public accumulatedFees;

    mapping(uint256 => Job) public jobs;
    mapping(uint256 => uint256) public jobBalances; // escrow balance per job

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // Initializer function (replaces constructor)
    function initialize(uint256 _platformFee) public initializer {
        __FreelanceMarketplace_init(_platformFee);
    }

    function __FreelanceMarketplace_init(
        uint256 _platformFee,
        address defaultAdmin,
        address pauser,
        address upgrader,
        address marketplaceAdmin
    ) internal initializer {
        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();

        _setupRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _setupRole(PAUSER_ROLE, pauser);
        _setupRole(UPGRADER_ROLE, upgrader);
        _setupRole(MARKETPLACE_ADMIN, marketplaceAdmin);

        platformFee = _platformFee;
        jobCounter = 0;
    }

    // UUPS upgrade authorization
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(UPGRADER_ROLE) {}

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // --- Marketplace Functions ---

    // 1. createJob
    function createJob() external whenNotPaused returns (uint256) {
        jobCounter++;
        uint256 jobId = jobCounter;
        jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            freelancer: address(0),
            escrowAmount: 0,
            status: JobStatus.Created,
            feedback: 0
        });
        emit JobCreated(jobId, msg.sender);
        return jobId;
    }

    // 2. cancelJob
    function cancelJob(uint256 jobId) external whenNotPaused {
        Job storage job = jobs[jobId];
        require(job.client == msg.sender, "Only client can cancel");
        require(
            job.status == JobStatus.Created || job.status == JobStatus.Funded,
            "Job cannot be cancelled"
        );
        job.status = JobStatus.Cancelled;
        emit JobCancelled(jobId);
    }

    // 3. fundJobEscrow
    function fundJobEscrow(
        uint256 jobId
    ) external payable whenNotPaused nonReentrant {
        Job storage job = jobs[jobId];
        require(job.client == msg.sender, "Only client can fund");
        require(job.status == JobStatus.Created, "Job not in correct state");
        require(msg.value > 0, "Funding amount must be > 0");

        job.escrowAmount = msg.value;
        job.status = JobStatus.Funded;
        jobBalances[jobId] = msg.value;
        emit JobFunded(jobId, msg.value);
    }

    // 4. acceptOffer
    function acceptOffer(uint256 jobId) external whenNotPaused {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Funded, "Job not funded or available");
        job.freelancer = msg.sender;
        job.status = JobStatus.Accepted;
        emit OfferAccepted(jobId, msg.sender);
    }

    // 5. submitWork
    function submitWork(uint256 jobId) external whenNotPaused {
        Job storage job = jobs[jobId];
        require(
            job.freelancer == msg.sender,
            "Only assigned freelancer can submit work"
        );
        require(job.status == JobStatus.Accepted, "Job not in accepted state");
        job.status = JobStatus.Submitted;
        emit WorkSubmitted(jobId);
    }

    // 6. approveWork
    function approveWork(uint256 jobId) external whenNotPaused {
        Job storage job = jobs[jobId];
        require(job.client == msg.sender, "Only client can approve work");
        require(job.status == JobStatus.Submitted, "Job not submitted");
        job.status = JobStatus.Approved;
        emit WorkApproved(jobId);
    }

    // 7. completeJob
    function completeJob(uint256 jobId) external whenNotPaused {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Approved, "Job not approved");
        job.status = JobStatus.Completed;
        emit JobCompleted(jobId);
    }

    // 8. disputeJob
    function disputeJob(uint256 jobId) external whenNotPaused {
        Job storage job = jobs[jobId];
        require(
            job.status == JobStatus.Approved ||
                job.status == JobStatus.Completed,
            "Job not disputeable"
        );
        job.status = JobStatus.Disputed;
        emit JobDisputed(jobId);
    }

    // 9. resolveDispute
    function resolveDispute(
        uint256 jobId,
        bool favorClient
    ) external whenNotPaused onlyRole(MARKETPLACE_ADMIN) {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Disputed, "Job not disputed");
        job.status = JobStatus.Resolved;
        emit DisputeResolved(jobId);
        // Additional logic to reassign funds can be implemented here
    }

    // 10. releasePayment
    function releasePayment(
        uint256 jobId
    ) external whenNotPaused onlyRole(MARKETPLACE_ADMIN) nonReentrant {
        Job storage job = jobs[jobId];
        require(
            job.status == JobStatus.Completed ||
                job.status == JobStatus.Resolved,
            "Job not ready for payment"
        );
        uint256 amount = jobBalances[jobId];
        require(amount > 0, "No funds available");

        // Calculate fee deduction
        uint256 fee = (amount * platformFee) / 10000;
        uint256 payout = amount - fee;
        accumulatedFees += fee;

        jobBalances[jobId] = 0;
        payable(job.freelancer).transfer(payout);
        emit PaymentReleased(jobId, payout, job.freelancer);
    }

    // 11. withdrawPayment (for cancelled jobs)
    function withdrawPayment(
        uint256 jobId
    ) external whenNotPaused nonReentrant {
        Job storage job = jobs[jobId];
        require(job.client == msg.sender, "Only client can withdraw");
        require(job.status == JobStatus.Cancelled, "Job not cancelled");
        uint256 amount = jobBalances[jobId];
        require(amount > 0, "No funds available");
        jobBalances[jobId] = 0;
        payable(job.client).transfer(amount);
        emit PaymentWithdrawn(jobId, amount, job.client);
    }

    // 12. leaveFeedback
    function leaveFeedback(
        uint256 jobId,
        uint256 rating
    ) external whenNotPaused {
        Job storage job = jobs[jobId];
        require(job.client == msg.sender, "Only client can leave feedback");
        require(job.status == JobStatus.Completed, "Job not completed");
        job.feedback = rating;
        emit FeedbackLeft(jobId, rating);
    }

    // 13. updateFreelancerReputation
    // Note: This function acts as a stub to integrate with the Freelance NFT contract.
    function updateFreelancerReputation(
        uint256 jobId,
        uint256 pointsDelta
    ) external whenNotPaused onlyRole(MARKETPLACE_ADMIN) {
        Job storage job = jobs[jobId];
        // In a real implementation, this would call an external NFT contract:
        // freelanceNFT.updatePoints(tokenId, pointsDelta);
        emit FreelancerReputationUpdated(job.freelancer, pointsDelta);
    }

    // 14. setPlatformFee
    function setPlatformFee(
        uint256 newFee
    ) external whenNotPaused onlyRole(MARKETPLACE_ADMIN) {
        platformFee = newFee;
        emit PlatformFeeSet(newFee);
    }

    // 15. withdrawPlatformFees
    function withdrawPlatformFees()
        external
        whenNotPaused
        onlyRole(MARKETPLACE_ADMIN)
        nonReentrant
    {
        uint256 amount = accumulatedFees;
        require(amount > 0, "No fees to withdraw");
        accumulatedFees = 0;
        payable(msg.sender).transfer(amount);
        emit PlatformFeesWithdrawn(amount, msg.sender);
    }

    // Fallback functions to receive ETH
    receive() external payable {}

    fallback() external payable {}
}
