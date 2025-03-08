// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {FreelancerNFT} from "../contracts/nfts/FreelancerNFT.sol";

/**
 * @notice Foundry script to deploy only the Freelancer NFT as an upgradeable contract.
 */
contract DeployFreelancerNFT is Script {
    function run() external {
        vm.startBroadcast();

        // 1. Load config
        HelperConfig helperConfig = new HelperConfig();

        (
            address defaultAdmin,
            address pauser,
            address minter,
            address upgrader
        ) = helperConfig.activeNetworkConfig();

        // 2. Deploy the logic (implementation) contract
        FreelancerNFT freelancerLogic = new FreelancerNFT();

        // 3. Encode initializer data using the "freelancerNFT" parameters
        bytes memory initData = abi.encodeWithSelector(
            FreelancerNFT.initialize.selector,
            defaultAdmin,
            pauser,
            minter,
            upgrader
        );

        // 4. Deploy UUPS proxy
        ERC1967Proxy freelancerProxy = new ERC1967Proxy(
            address(freelancerLogic),
            initData
        );

        // 5. Cast
        FreelancerNFT freelancerNFT = FreelancerNFT(address(freelancerProxy));

        // Logging
        console.log(
            "------------------- Freelancer NFT Deployment Info -------------------"
        );
        console.log("Chain ID:        ", block.chainid);
        console.log("defaultAdmin:    ", defaultAdmin);
        console.log("pauser:          ", pauser);
        console.log("minter:          ", minter);
        console.log("upgrader:        ", upgrader);

        console.log("Logic (Freelancer): ", address(freelancerLogic));
        console.log("Proxy (Freelancer): ", address(freelancerProxy));
        console.log(
            "Name/Symbol:     ",
            freelancerNFT.name(),
            freelancerNFT.symbol()
        );
        // console.log("Version:         ", freelancer.version);
        console.log(
            "-------------------------------------------------------------------"
        );

        vm.stopBroadcast();
    }
}
