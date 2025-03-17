// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {ClientNFT} from "../contracts/nfts/ClientNFT.sol";
import {IClientNFT} from "../contracts/interfaces/IClientNFT.sol";

contract ClientNFTTest is Test {
    ClientNFT clientNFT;

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
        clientNFT = new ClientNFT();

        // Initialize the contract with roles
        clientNFT.initialize(admin, pauser, minter, upgrader);
    }

    // Test initialization and roles
    function testInitialization() public {
        // Check name and symbol
        assertEq(clientNFT.name(), "ClientNFT");
        assertEq(clientNFT.symbol(), "MIC");

        // Check roles
        assertTrue(clientNFT.hasRole(DEFAULT_ADMIN_ROLE, admin));
        assertTrue(clientNFT.hasRole(PAUSER_ROLE, pauser));
        assertTrue(clientNFT.hasRole(MINTER_ROLE, minter));
        assertTrue(clientNFT.hasRole(UPGRADER_ROLE, upgrader));
    }

    // Test minting functionality
    function testSafeMint() public {
        // Mint as a minter role
        vm.startPrank(minter);

        // Test metadata URI
        string memory uri = "ipfs://QmTest";
        clientNFT.safeMint(user1, uri);

        // Check token ownership
        assertEq(clientNFT.balanceOf(user1), 1);
        assertEq(clientNFT.ownerOf(0), user1);
        assertEq(clientNFT.tokenURI(0), uri);

        // Check tokenIdOf mapping is correct
        assertEq(clientNFT.tokenIdOf(user1), 0);

        vm.stopPrank();
    }

    // Test pause functionality
    function testPauseAndUnpause() public {
        // Pause as pauser role
        vm.startPrank(pauser);
        clientNFT.pause();
        assertTrue(clientNFT.paused());

        // Mint should revert while paused
        vm.expectRevert("ERC721Pausable: token transfer while paused");
        vm.startPrank(minter);
        clientNFT.safeMint(user1, "ipfs://QmTest");
        vm.stopPrank();

        // Unpause
        vm.startPrank(pauser);
        clientNFT.unpause();
        assertFalse(clientNFT.paused());
        vm.stopPrank();

        // Now minting should work
        vm.startPrank(minter);
        clientNFT.safeMint(user1, "ipfs://QmTest");
        assertEq(clientNFT.balanceOf(user1), 1);
        vm.stopPrank();
    }

    // Test role restrictions
    function testRoleRestrictions() public {
        // Try to mint as non-minter
        vm.startPrank(user1);
        vm.expectRevert(); // Should revert as user1 doesn't have MINTER_ROLE
        clientNFT.safeMint(user2, "ipfs://QmTest");

        // Try to pause as non-pauser
        vm.expectRevert(); // Should revert as user1 doesn't have PAUSER_ROLE
        clientNFT.pause();
        vm.stopPrank();
    }

    // Test multiple token minting and transfers
    function testMultipleTokens() public {
        vm.startPrank(minter);

        // Mint multiple tokens to different users
        clientNFT.safeMint(user1, "ipfs://QmTest1");
        clientNFT.safeMint(user2, "ipfs://QmTest2");

        // Check balances
        assertEq(clientNFT.balanceOf(user1), 1);
        assertEq(clientNFT.balanceOf(user2), 1);

        // Check tokenIdOf mapping
        assertEq(clientNFT.tokenIdOf(user1), 0);
        assertEq(clientNFT.tokenIdOf(user2), 1);

        vm.stopPrank();

        // Test transfers
        vm.startPrank(user1);
        clientNFT.transferFrom(user1, user2, 0);
        vm.stopPrank();

        // Check new ownership
        assertEq(clientNFT.balanceOf(user1), 0);
        assertEq(clientNFT.balanceOf(user2), 2);
        assertEq(clientNFT.ownerOf(0), user2);

        // tokenIdOf should still point to the original token even after transfer
        assertEq(clientNFT.tokenIdOf(user1), 0);
    }
}
