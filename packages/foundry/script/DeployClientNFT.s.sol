// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {ClientNFT} from "../contracts/nfts/ClientNFT.sol";

/**
 * @notice Foundry script to deploy only the Client NFT as an upgradeable contract.
 */
contract DeployClientNFT is Script {
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
        ClientNFT clientLogic = new ClientNFT();

        // 3. Encode initializer data using the "clientNFT" parameters
        bytes memory initData = abi.encodeWithSelector(
            ClientNFT.initialize.selector,
            defaultAdmin,
            pauser,
            minter,
            upgrader
        );

        // 4. Deploy UUPS proxy
        ERC1967Proxy clientProxy = new ERC1967Proxy(
            address(clientLogic),
            initData
        );

        // 5. Cast
        ClientNFT clientNFT = ClientNFT(address(clientProxy));

        // Logging
        console.log(
            "------------------- Client NFT Deployment Info -------------------"
        );
        console.log("Chain ID:        ", block.chainid);
        console.log("defaultAdmin:    ", defaultAdmin);
        console.log("pauser:          ", pauser);
        console.log("minter:          ", minter);
        console.log("upgrader:        ", upgrader);

        console.log("Logic (Client): ", address(clientLogic));
        console.log("Proxy (Client): ", address(clientProxy));
        console.log("Name/Symbol:     ", clientNFT.name(), clientNFT.symbol());
        // console.log("Version:         ", client.version);
        console.log(
            "-------------------------------------------------------------------"
        );

        vm.stopBroadcast();
    }
}
