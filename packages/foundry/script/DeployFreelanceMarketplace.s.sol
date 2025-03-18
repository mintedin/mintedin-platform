// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {FreelanceMarketplace} from "../contracts/FreelanceMarketplace.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployFreelanceMarketplace is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        // Get deployment parameters from environment
        address defaultAdmin = vm.envAddress("DEFAULT_ADMIN_ADDRESS");
        if (defaultAdmin == address(0)) defaultAdmin = deployerAddress;

        address pauser = vm.envAddress("PAUSER_ADDRESS");
        if (pauser == address(0)) pauser = deployerAddress;

        address upgrader = vm.envAddress("UPGRADER_ADDRESS");
        if (upgrader == address(0)) upgrader = deployerAddress;

        address marketplaceAdmin = vm.envAddress("MARKETPLACE_ADMIN_ADDRESS");
        if (marketplaceAdmin == address(0)) marketplaceAdmin = deployerAddress;

        address freelancerNFT = vm.envAddress("FREELANCER_NFT_ADDRESS");
        address clientNFT = vm.envAddress("CLIENT_NFT_ADDRESS");

        uint256 platformFee = vm.envUint("PLATFORM_FEE");
        if (platformFee == 0) platformFee = 250; // Default 2.5%

        console.log(
            "Deploying FreelanceMarketplace with the following parameters:"
        );
        console.log("Default Admin:", defaultAdmin);
        console.log("Pauser:", pauser);
        console.log("Upgrader:", upgrader);
        console.log("Marketplace Admin:", marketplaceAdmin);
        console.log("Freelancer NFT:", freelancerNFT);
        console.log("Client NFT:", clientNFT);
        console.log("Platform Fee:", platformFee);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy the implementation contract
        FreelanceMarketplace implementation = new FreelanceMarketplace();
        console.log("Implementation deployed at:", address(implementation));

        // 2. Prepare the initialization data
        bytes memory initData = abi.encodeWithSelector(
            FreelanceMarketplace.initialize.selector,
            defaultAdmin,
            pauser,
            upgrader,
            marketplaceAdmin,
            freelancerNFT,
            clientNFT,
            platformFee
        );

        // 3. Deploy the proxy pointing to the implementation
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implementation),
            initData
        );
        console.log("Proxy deployed at:", address(proxy));

        // Note: If you need to interact with the proxied contract, you would cast like this:
        // FreelanceMarketplace marketplace = FreelanceMarketplace(payable(address(proxy)));

        vm.stopBroadcast();

        console.log("FreelanceMarketplace deployment completed!");
        console.log("Proxy (use this address):", address(proxy));
        console.log("Implementation:", address(implementation));
    }
}
