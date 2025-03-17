// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {FreelanceMarketplace} from "../contracts/FreelanceMarketplace.sol";
import {IFreelanceMarketplace} from "../contracts/interfaces/IFreelanceMarketplace.sol";
import {FreelancerNFT} from "../contracts/nfts/FreelancerNFT.sol";
import {ClientNFT} from "../contracts/nfts/ClientNFT.sol";
import {IFreelancerNFT} from "../contracts/interfaces/IFreelancerNFT.sol";
import {IClientNFT} from "../contracts/interfaces/IClientNFT.sol";

contract FreelanceMarketplaceTest is Test {
    FreelanceMarketplace marketplace;
    FreelancerNFT freelancerNFT;
    ClientNFT clientNFT;

    // Test addresses
    address admin = address(0x1);
    address pauser = address(0x2);
    address upgrader = address(0x3);
    address marketplaceAdmin = address(0x4);
    address client = address(0x5);
    address freelancer = address(0x6);
    address user = address(0x7);

    // Role constants
    bytes32 constant DEFAULT_ADMIN_ROLE = 0x00;
    bytes32 constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 constant MARKETPLACE_ADMIN = keccak256("MARKETPLACE_ADMIN");

    // Test values
    uint256 initialPlatformFee = 250; // 2.5%
    uint256 jobAmount = 1 ether;

    function setUp() public {
        // Deploy NFT contracts
        freelancerNFT = new FreelancerNFT();
        clientNFT = new ClientNFT();

        // Initialize NFT contracts
        freelancerNFT.initialize(admin, pauser, admin, upgrader);
        clientNFT.initialize(admin, pauser, admin, upgrader);

        // Deploy marketplace contract
        marketplace = new FreelanceMarketplace();

        // Initialize marketplace contract
        marketplace.initialize(
            admin,
            pauser,
            upgrader,
            marketplaceAdmin,
            address(freelancerNFT),
            address(clientNFT),
            initialPlatformFee
        );

        // Mint NFTs for testing
        vm.startPrank(admin);
        freelancerNFT.safeMint(freelancer, "ipfs://freelancer-metadata");
        clientNFT.safeMint(client, "ipfs://client-metadata");
        vm.stopPrank();

        // Deal ETH to accounts
        vm.deal(client, 10 ether);
        vm.deal(freelancer, 1 ether);
    }

    // Test initialization
    function testInitialization() public {
        assertEq(marketplace.getFreelancerNFT(), address(freelancerNFT));
        assertEq(marketplace.getClientNFT(), address(clientNFT));
        assertEq(marketplace.getPlatformFee(), initialPlatformFee);

        // Check roles
        assertTrue(marketplace.hasRole(DEFAULT_ADMIN_ROLE, admin));
        assertTrue(marketplace.hasRole(PAUSER_ROLE, pauser));
        assertTrue(marketplace.hasRole(UPGRADER_ROLE, upgrader));
        assertTrue(marketplace.hasRole(MARKETPLACE_ADMIN, marketplaceAdmin));
    }

    // Test job creation
    function testCreateJob() public {
        // Create job as client
        vm.startPrank(client);
        uint256 jobId = marketplace.createJob{value: jobAmount}();
        vm.stopPrank();

        assertEq(marketplace.getTotalJobCount(), 1);

        // Attempt to create job without client NFT
        vm.startPrank(user);
        vm.expectRevert("Client does not have valid NFT");
        marketplace.createJob{value: jobAmount}();
        vm.stopPrank();
    }

    // Test the entire job workflow (happy path)
    function testCompleteJobWorkflow() public {
        // 1. Create job
        vm.startPrank(client);
        uint256 jobId = marketplace.createJob{value: jobAmount}();
        vm.stopPrank();

        // 2. Fund job (additional funding)
        vm.startPrank(client);
        marketplace.fundJobEscrow{value: 0.5 ether}(jobId);
        vm.stopPrank();

        // 3. Accept offer
        vm.startPrank(freelancer);
        marketplace.acceptOffer(jobId);
        vm.stopPrank();

        // 4. Submit work
        vm.startPrank(freelancer);
        marketplace.submitWork(jobId);
        vm.stopPrank();

        // 5. Approve work
        vm.startPrank(client);
        marketplace.approveWork(jobId);
        vm.stopPrank();

        // 6. Complete job
        vm.startPrank(client);
        marketplace.completeJob(jobId);
        vm.stopPrank();

        // 7. Release payment
        uint256 balanceBefore = freelancer.balance;
        vm.startPrank(marketplaceAdmin);
        marketplace.releasePayment(jobId);
        vm.stopPrank();

        // Calculate expected payout (amount minus platform fee)
        uint256 totalJobAmount = 1.5 ether; // Initial + additional funding
        uint256 platformFee = (totalJobAmount * initialPlatformFee) / 10000;
        uint256 expectedPayout = totalJobAmount - platformFee;

        // Check freelancer received payment
        assertEq(freelancer.balance, balanceBefore + expectedPayout);

        // Check platform fees accrued
        assertEq(marketplace.getTotalPlatformFees(), platformFee);
    }

    // Test job cancellation and withdrawal
    function testJobCancellationAndWithdrawal() public {
        // Create job
        vm.startPrank(client);
        uint256 jobId = marketplace.createJob{value: jobAmount}();
        vm.stopPrank();

        // Cancel job
        vm.startPrank(client);
        marketplace.cancelJob(jobId);
        vm.stopPrank();

        // Withdraw payment
        uint256 balanceBefore = client.balance;
        vm.startPrank(client);
        marketplace.withdrawPayment(jobId);
        vm.stopPrank();

        // Check client received funds back
        assertEq(client.balance, balanceBefore + jobAmount);
    }

    // Test dispute resolution
    function testDisputeResolution() public {
        // Create and progress job to completion
        vm.startPrank(client);
        uint256 jobId = marketplace.createJob{value: jobAmount}();
        vm.stopPrank();

        vm.startPrank(freelancer);
        marketplace.acceptOffer(jobId);
        marketplace.submitWork(jobId);
        vm.stopPrank();

        vm.startPrank(client);
        marketplace.approveWork(jobId);
        marketplace.completeJob(jobId);
        vm.stopPrank();

        // Raise dispute
        vm.startPrank(client);
        marketplace.disputeJob(jobId);
        vm.stopPrank();

        // Resolve dispute
        vm.startPrank(marketplaceAdmin);
        marketplace.resolveDispute(jobId, true);
        vm.stopPrank();

        // Release payment after resolution
        uint256 balanceBefore = freelancer.balance;
        vm.startPrank(marketplaceAdmin);
        marketplace.releasePayment(jobId);
        vm.stopPrank();

        // Calculate expected payout
        uint256 platformFee = (jobAmount * initialPlatformFee) / 10000;
        uint256 expectedPayout = jobAmount - platformFee;

        // Check freelancer received payment
        assertEq(freelancer.balance, balanceBefore + expectedPayout);
    }

    // Test admin functions
    function testAdminFunctions() public {
        // Set platform fee
        vm.startPrank(marketplaceAdmin);
        uint256 newFee = 500; // 5%
        marketplace.setPlatformFee(newFee);
        vm.stopPrank();

        assertEq(marketplace.getPlatformFee(), newFee);

        // Create job and complete workflow to generate fees
        vm.startPrank(client);
        uint256 jobId = marketplace.createJob{value: jobAmount}();
        vm.stopPrank();

        vm.startPrank(freelancer);
        marketplace.acceptOffer(jobId);
        marketplace.submitWork(jobId);
        vm.stopPrank();

        vm.startPrank(client);
        marketplace.approveWork(jobId);
        marketplace.completeJob(jobId);
        vm.stopPrank();

        vm.startPrank(marketplaceAdmin);
        marketplace.releasePayment(jobId);
        vm.stopPrank();

        // Calculate and verify platform fees
        uint256 platformFee = (jobAmount * newFee) / 10000;
        assertEq(marketplace.getTotalPlatformFees(), platformFee);

        // Withdraw platform fees
        uint256 balanceBefore = marketplaceAdmin.balance;
        vm.startPrank(marketplaceAdmin);
        marketplace.withdrawPlatformFees();
        vm.stopPrank();

        // Verify marketplaceAdmin received fees
        assertEq(marketplaceAdmin.balance, balanceBefore + platformFee);
        assertEq(marketplace.getTotalPlatformFees(), 0);
    }

    // Test pause functionality
    function testPauseFunctionality() public {
        // Pause the marketplace
        vm.startPrank(pauser);
        marketplace.pause();
        vm.stopPrank();

        // Verify operations fail when paused
        vm.startPrank(client);
        vm.expectRevert("Pausable: paused");
        marketplace.createJob{value: jobAmount}();
        vm.stopPrank();

        // Unpause the marketplace
        vm.startPrank(pauser);
        marketplace.unpause();
        vm.stopPrank();

        // Verify operations work after unpause
        vm.startPrank(client);
        uint256 jobId = marketplace.createJob{value: jobAmount}();
        vm.stopPrank();

        assertEq(marketplace.getTotalJobCount(), 1);
    }

    // Test role validations
    function testRoleValidations() public {
        // Try to set platform fee as non-admin
        vm.startPrank(user);
        vm.expectRevert();
        marketplace.setPlatformFee(500);
        vm.stopPrank();

        // Try to withdraw fees as non-admin
        vm.startPrank(user);
        vm.expectRevert();
        marketplace.withdrawPlatformFees();
        vm.stopPrank();

        // Try to pause as non-pauser
        vm.startPrank(user);
        vm.expectRevert();
        marketplace.pause();
        vm.stopPrank();
    }

    // Test feedback submission
    function testLeaveFeedback() public {
        // Create and complete a job
        vm.startPrank(client);
        uint256 jobId = marketplace.createJob{value: jobAmount}();
        vm.stopPrank();

        vm.startPrank(freelancer);
        marketplace.acceptOffer(jobId);
        marketplace.submitWork(jobId);
        vm.stopPrank();

        vm.startPrank(client);
        marketplace.approveWork(jobId);
        marketplace.completeJob(jobId);

        // Leave feedback
        uint256 rating = 5;
        marketplace.leaveFeedback(jobId, rating);
        vm.stopPrank();

        // Update freelancer reputation (testing event emission)
        vm.recordLogs();
        vm.startPrank(marketplaceAdmin);
        marketplace.updateFreelancerReputation(jobId, 10);
        vm.stopPrank();

        VmSafe.Log[] memory entries = vm.getRecordedLogs();
        assertEq(entries.length, 1); // One event emitted
        // Check event emitted (simplified verification)
        // Full verification would decode the event data
    }
}
