// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {IFreelanceMarketplace} from "./interfaces/IFreelanceMarketplace.sol";
import {IFreelancerNFT} from "./interfaces/IFreelancerNFT.sol";
import {IClientNFT} from "./interfaces/IClientNFT.sol";

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

    /// @custom:storage-location MintedIn:FreelanceMarketplace.storage.GlobalStorage
    struct GlobalStorage {
        address freelancerNFT;
        address clientNFT;
        uint256 platformFee; // In basis points, e.g. 100 = 1%
        uint256 totalPlatformFees;
        uint256 totalJobCount;
    }

    // keccak256(abi.encode(uint256(keccak256("FreelanceMarketplace.storage.GlobalStorage")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant GlobalStorageLocation =
        0x77e329dbd18313a6498d1f7e745f7c5db79ca6e9ca086a1fed9bec16ef173d00;

    function _getGlobalStorage()
        private
        pure
        returns (GlobalStorage storage market)
    {
        assembly {
            market.slot := GlobalStorageLocation
        }
    }

    /// @custom:storage-location MintedIn:FreelanceMarketplace.storage.JobStorage
    struct JobStorage {
        mapping(uint256 => Job) jobs;
    }

    // keccak256(abi.encode(uint256(keccak256("FreelanceMarketplace.storage.JobStorage")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant JobStorageLocation =
        0xd369c3b4404b67d31e97703c9fa86feddd7b94aac296d336931ec8dcfea86200;

    function _getJobStorage() private pure returns (JobStorage storage jobs) {
        assembly {
            jobs.slot := JobStorageLocation
        }
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address defaultAdmin,
        address pauser,
        address upgrader,
        address marketplaceAdmin,
        address initialFreelancerNFT,
        address initialClientNFT,
        uint256 initialPlatformFee
    ) external initializer {
        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(UPGRADER_ROLE, upgrader);
        _grantRole(MARKETPLACE_ADMIN, marketplaceAdmin);

        GlobalStorage storage market = _getGlobalStorage();
        market.freelancerNFT = initialFreelancerNFT;
        market.clientNFT = initialClientNFT;
        market.platformFee = initialPlatformFee;
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

    // Fallback functions to receive ETH
    receive() external payable {}

    fallback() external payable {}

    // --- Marketplace Functions ---

    // 1. createJob
    function createJob() external payable whenNotPaused returns (uint256) {
        _validateClient(msg.sender);

        GlobalStorage storage market = _getGlobalStorage();

        uint256 jobId = market.totalJobCount++;

        JobStorage storage jobs = _getJobStorage();

        jobs.jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            freelancer: address(0),
            jobInitialBalance: msg.value,
            jobCurrentBalance: msg.value,
            status: JobStatus.Created,
            feedback: 0
        });

        emit JobCreated(jobId, msg.sender);
        return jobId;
    }

    // 2. cancelJob
    function cancelJob(uint256 jobId) external whenNotPaused {
        JobStorage storage jobs = _getJobStorage();
        Job storage job = jobs.jobs[jobId];

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
        JobStorage storage jobs = _getJobStorage();
        Job storage job = jobs.jobs[jobId];

        require(job.client == msg.sender, "Only client can fund");
        require(job.status == JobStatus.Created, "Job not in correct state");
        require(msg.value > 0, "Funding amount must be > 0");

        job.status = JobStatus.Funded;
        job.jobInitialBalance += msg.value;
        job.jobCurrentBalance += msg.value;

        emit JobFunded(jobId, msg.value);
    }

    // 4. acceptOffer
    function acceptOffer(uint256 jobId) external whenNotPaused {
        _validateFreelancer(msg.sender);

        JobStorage storage jobs = _getJobStorage();
        Job storage job = jobs.jobs[jobId];

        require(job.status == JobStatus.Funded, "Job not funded or available");
        job.freelancer = msg.sender;
        job.status = JobStatus.Accepted;
        emit OfferAccepted(jobId, msg.sender);
    }

    // 5. submitWork
    function submitWork(uint256 jobId) external whenNotPaused {
        JobStorage storage jobs = _getJobStorage();
        Job storage job = jobs.jobs[jobId];

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
        JobStorage storage jobs = _getJobStorage();
        Job storage job = jobs.jobs[jobId];

        require(job.client == msg.sender, "Only client can approve work");
        require(job.status == JobStatus.Submitted, "Job not submitted");
        job.status = JobStatus.Approved;
        emit WorkApproved(jobId);
    }

    // 7. completeJob
    function completeJob(uint256 jobId) external whenNotPaused {
        JobStorage storage jobs = _getJobStorage();
        Job storage job = jobs.jobs[jobId];

        require(job.status == JobStatus.Approved, "Job not approved");
        job.status = JobStatus.Completed;
        emit JobCompleted(jobId);
    }

    // 8. disputeJob
    function disputeJob(uint256 jobId) external whenNotPaused {
        JobStorage storage jobs = _getJobStorage();
        Job storage job = jobs.jobs[jobId];

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
        JobStorage storage jobs = _getJobStorage();
        Job storage job = jobs.jobs[jobId];

        require(job.status == JobStatus.Disputed, "Job not disputed");
        job.status = JobStatus.Resolved;
        emit DisputeResolved(jobId);
        // Additional logic to reassign funds can be implemented here
    }

    // 10. releasePayment
    function releasePayment(
        uint256 jobId
    ) external whenNotPaused onlyRole(MARKETPLACE_ADMIN) nonReentrant {
        GlobalStorage storage market = _getGlobalStorage();

        JobStorage storage jobs = _getJobStorage();
        Job storage job = jobs.jobs[jobId];

        require(
            job.status == JobStatus.Completed ||
                job.status == JobStatus.Resolved,
            "Job not ready for payment"
        );
        uint256 amount = job.jobCurrentBalance;
        require(amount > 0, "No funds available");

        // Calculate fee deduction
        uint256 fee = (amount * market.platformFee) / 10000;
        uint256 payout = amount - fee;
        market.totalPlatformFees += fee;

        job.jobCurrentBalance = 0;
        payable(job.freelancer).transfer(payout);
        emit PaymentReleased(jobId, payout, job.freelancer);
    }

    // 11. withdrawPayment (for cancelled jobs)
    function withdrawPayment(
        uint256 jobId
    ) external whenNotPaused nonReentrant {
        JobStorage storage jobs = _getJobStorage();
        Job storage job = jobs.jobs[jobId];

        require(job.client == msg.sender, "Only client can withdraw");
        require(job.status == JobStatus.Cancelled, "Job not cancelled");

        uint256 amount = job.jobCurrentBalance;
        require(amount > 0, "No funds available");

        job.jobCurrentBalance = 0;
        payable(job.client).transfer(amount);
        emit PaymentWithdrawn(jobId, amount, job.client);
    }

    // 12. leaveFeedback
    function leaveFeedback(
        uint256 jobId,
        uint256 rating
    ) external whenNotPaused {
        JobStorage storage jobs = _getJobStorage();
        Job storage job = jobs.jobs[jobId];

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
        JobStorage storage jobs = _getJobStorage();
        Job storage job = jobs.jobs[jobId];
        // In a real implementation, this would call an external NFT contract:
        // FreelancerNFT.updatePoints(tokenId, pointsDelta);
        emit FreelancerReputationUpdated(job.freelancer, pointsDelta);
    }

    // 14. setPlatformFee
    function setPlatformFee(
        uint256 newFee
    ) external whenNotPaused onlyRole(MARKETPLACE_ADMIN) {
        GlobalStorage storage market = _getGlobalStorage();
        market.platformFee = newFee;
        emit PlatformFeeSet(newFee);
    }

    // 15. withdrawPlatformFees
    function withdrawPlatformFees()
        external
        whenNotPaused
        onlyRole(MARKETPLACE_ADMIN)
        nonReentrant
    {
        GlobalStorage storage market = _getGlobalStorage();

        uint256 amount = market.totalPlatformFees;
        require(amount > 0, "No fees to withdraw");
        market.totalPlatformFees = 0;
        payable(msg.sender).transfer(amount);
        emit PlatformFeesWithdrawn(amount, msg.sender);
    }

    function getFreelancerNFT() external view returns (address) {
        GlobalStorage storage market = _getGlobalStorage();
        return market.freelancerNFT;
    }

    function getClientNFT() external view returns (address) {
        GlobalStorage storage market = _getGlobalStorage();
        return market.clientNFT;
    }

    function getPlatformFee() external view returns (uint256) {
        GlobalStorage storage market = _getGlobalStorage();
        return market.platformFee;
    }

    function getTotalPlatformFees() external view returns (uint256) {
        GlobalStorage storage market = _getGlobalStorage();
        return market.totalPlatformFees;
    }

    function getTotalJobCount() external view returns (uint256) {
        GlobalStorage storage market = _getGlobalStorage();
        return market.totalJobCount;
    }

    function _validateClient(address client) private view {
        GlobalStorage storage market = _getGlobalStorage();

        uint256 tokenId = IClientNFT(market.clientNFT).tokenIdOf(client);

        require(tokenId != 0, "Client does not have valid NFT");
    }

    function _validateFreelancer(address freelancer) private view {
        GlobalStorage storage market = _getGlobalStorage();

        uint256 tokenId = IFreelancerNFT(market.freelancerNFT).tokenIdOf(
            freelancer
        );

        require(tokenId != 0, "Freelancer does not have valid NFT");
    }
}
