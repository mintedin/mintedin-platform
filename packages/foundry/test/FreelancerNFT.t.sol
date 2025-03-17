// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {FreelancerNFT} from "../contracts/nfts/FreelancerNFT.sol";
import {IFreelancerNFT} from "../contracts/interfaces/IFreelancerNFT.sol";

contract FreelancerNFTTest is Test {
    FreelancerNFT freelancerNFT;

    address admin = address(1);
    address pauser = address(2);
    address minter = address(3);
    address upgrader = address(4);
    address user1 = address(5);
    address user2 = address(6);

    // Role constants
    bytes32 constant DEFAULT_ADMIN_ROLE = 0x00;
    bytes32 constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    function setUp() public {
        // Deploy the NFT contract
        freelancerNFT = new FreelancerNFT();

        // Initialize the contract with roles
        freelancerNFT.initialize(admin, pauser, minter, upgrader);
    }

    // Test initialization and roles
    function testInitialization() public {
        // Check name and symbol
        assertEq(freelancerNFT.name(), "FreelanceNFT");
        assertEq(freelancerNFT.symbol(), "MIF");

        // Check roles
        assertTrue(freelancerNFT.hasRole(DEFAULT_ADMIN_ROLE, admin));
        assertTrue(freelancerNFT.hasRole(PAUSER_ROLE, pauser));
        assertTrue(freelancerNFT.hasRole(MINTER_ROLE, minter));
        assertTrue(freelancerNFT.hasRole(UPGRADER_ROLE, upgrader));
    }

    // Test minting functionality
    function testSafeMint() public {
        // Mint as a minter role
        vm.startPrank(minter);

        // Test metadata URI
        string memory uri = "ipfs://QmTest";
        freelancerNFT.safeMint(user1, uri);

        // Check token ownership
        assertEq(freelancerNFT.balanceOf(user1), 1);
        assertEq(freelancerNFT.ownerOf(0), user1);
        assertEq(freelancerNFT.tokenURI(0), uri);

        // Check tokenIdOf mapping is correct
        assertEq(freelancerNFT.tokenIdOf(user1), 0);

        vm.stopPrank();
    }

    // Test pause functionality
    function testPauseAndUnpause() public {
        // Pause as pauser role
        vm.startPrank(pauser);
        freelancerNFT.pause();
        assertTrue(freelancerNFT.paused());

        // Try to mint while paused - should revert
        vm.expectRevert("ERC721Pausable: token transfer while paused");
        freelancerNFT.safeMint(user1, "ipfs://QmTest");

        // Unpause
        freelancerNFT.unpause();
        assertFalse(freelancerNFT.paused());

        vm.stopPrank();

        // Now minting should work
        vm.startPrank(minter);
        freelancerNFT.safeMint(user1, "ipfs://QmTest");
        assertEq(freelancerNFT.balanceOf(user1), 1);
        vm.stopPrank();
    }

    // Test role restrictions
    function testRoleRestrictions() public {
        // Try to mint as non-minter
        vm.startPrank(user1);
        vm.expectRevert(); // Should revert as user1 doesn't have MINTER_ROLE
        freelancerNFT.safeMint(user2, "ipfs://QmTest");

        // Try to pause as non-pauser
        vm.expectRevert(); // Should revert as user1 doesn't have PAUSER_ROLE
        freelancerNFT.pause();
        vm.stopPrank();
    }

    // Test freelancer data functionality
    function testFreelancerData() public {
        // Mint a token first
        vm.startPrank(minter);
        freelancerNFT.safeMint(user1, "ipfs://QmTest");

        // Create freelancer data
        IFreelancerNFT.Freelancer memory data = IFreelancerNFT.Freelancer({
            revenue: 1000,
            jobAcceptedCount: 5,
            jobCompletedCount: 3
        });

        // Set the data
        freelancerNFT.setFreelancerData(0, data);

        // Get and verify the data
        IFreelancerNFT.Freelancer memory retrievedData = freelancerNFT
            .getFreelancerData(0);
        assertEq(retrievedData.revenue, 1000);
        assertEq(retrievedData.jobAcceptedCount, 5);
        assertEq(retrievedData.jobCompletedCount, 3);

        vm.stopPrank();
    }

    // Test freelancer data access control
    function testFreelancerDataAccessControl() public {
        // Mint a token first
        vm.startPrank(minter);
        freelancerNFT.safeMint(user1, "ipfs://QmTest");
        vm.stopPrank();

        // Try to set data as non-minter
        vm.startPrank(user1);
        IFreelancerNFT.Freelancer memory data = IFreelancerNFT.Freelancer({
            revenue: 1000,
            jobAcceptedCount: 5,
            jobCompletedCount: 3
        });

        vm.expectRevert(); // Should revert as user1 doesn't have MINTER_ROLE
        freelancerNFT.setFreelancerData(0, data);
        vm.stopPrank();
    }
}
