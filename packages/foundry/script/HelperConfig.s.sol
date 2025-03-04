// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        address defaultAdmin;
        address pauser;
        address minter;
        address upgrader;
    }

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 534352) {
            activeNetworkConfig = getScrollConfig();
        } else if (block.chainid == 534351) {
            activeNetworkConfig = getScrollSepoliaConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilConfig();
        }
    }

    function getScrollConfig() internal pure returns (NetworkConfig memory) {
        return
            NetworkConfig({
                defaultAdmin: 0xd2530AeE865c1afcb7138745f671004B16423348,
                pauser: 0xd2530AeE865c1afcb7138745f671004B16423348,
                minter: 0xd2530AeE865c1afcb7138745f671004B16423348,
                upgrader: 0xd2530AeE865c1afcb7138745f671004B16423348
            });
    }

    function getScrollSepoliaConfig()
        internal
        pure
        returns (NetworkConfig memory)
    {
        return
            NetworkConfig({
                defaultAdmin: 0xd2530AeE865c1afcb7138745f671004B16423348,
                pauser: 0xd2530AeE865c1afcb7138745f671004B16423348,
                minter: 0xd2530AeE865c1afcb7138745f671004B16423348,
                upgrader: 0xd2530AeE865c1afcb7138745f671004B16423348
            });
    }

    function getOrCreateAnvilConfig()
        internal
        pure
        returns (NetworkConfig memory)
    {
        // For local dev or unknown chain
        return
            NetworkConfig({
                defaultAdmin: address(0x1),
                pauser: address(0x1),
                minter: address(0x1),
                upgrader: address(0x1)
            });
    }
}
