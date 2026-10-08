// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {ActionReceiptRegistry} from "../contracts/ActionReceiptRegistry.sol";

contract DeployActionReceiptRegistry is Script {
    function run() external returns (ActionReceiptRegistry registry) {
        require(block.chainid == 10143, "Monad Testnet only");
        vm.startBroadcast();
        registry = new ActionReceiptRegistry();
        vm.stopBroadcast();
    }
}
