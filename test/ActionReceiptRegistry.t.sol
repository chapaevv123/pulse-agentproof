// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {ActionReceiptRegistry} from "../contracts/ActionReceiptRegistry.sol";

contract ActionReceiptRegistryTest is Test {
    ActionReceiptRegistry internal registry;
    bytes32 internal constant RECEIPT_ID = keccak256("receipt-1");
    bytes32 internal constant AGENT_ID = keccak256("agent-1");
    bytes32 internal constant INTENT_HASH = keccak256("intent");
    bytes32 internal constant ACTION_HASH = keccak256("action");
    bytes32 internal constant POLICY_HASH = keccak256("policy");
    bytes32 internal constant EVIDENCE_HASH = keccak256("evidence");
    bytes32 internal constant REASON_HASH = keccak256("reasons");

    event ActionReceiptAnchored(bytes32 indexed receiptId, bytes32 indexed agentId, bytes32 actionHash, uint8 verdict, bytes32 reasonCodeHash);

    function setUp() public {
        registry = new ActionReceiptRegistry();
    }

    function testCreatesImmutableReceiptAndEmitsEvent() public {
        vm.expectEmit(true, true, false, true);
        emit ActionReceiptAnchored(RECEIPT_ID, AGENT_ID, ACTION_HASH, 1, REASON_HASH);
        _anchor(RECEIPT_ID, 1);

        ActionReceiptRegistry.ReceiptAnchor memory receipt = registry.getReceipt(RECEIPT_ID);
        assertEq(receipt.agentId, AGENT_ID);
        assertEq(receipt.intentHash, INTENT_HASH);
        assertEq(receipt.actionHash, ACTION_HASH);
        assertEq(receipt.policyHash, POLICY_HASH);
        assertEq(receipt.evidenceHash, EVIDENCE_HASH);
        assertEq(receipt.reasonCodeHash, REASON_HASH);
        assertEq(uint8(receipt.verdict), 1);
        assertEq(receipt.submitter, address(this));
    }

    function testRejectsDuplicateReceipt() public {
        _anchor(RECEIPT_ID, 1);
        vm.expectRevert(abi.encodeWithSelector(ActionReceiptRegistry.ReceiptAlreadyExists.selector, RECEIPT_ID));
        _anchor(RECEIPT_ID, 1);
    }

    function testRejectsInvalidInputs() public {
        vm.expectRevert(ActionReceiptRegistry.EmptyReceiptId.selector);
        _anchor(bytes32(0), 1);
        vm.expectRevert(ActionReceiptRegistry.InvalidVerdict.selector);
        _anchor(RECEIPT_ID, 0);
    }

    function testBindsExecutionOnceForAllow() public {
        bytes32 executionHash = keccak256("execution");
        _anchor(RECEIPT_ID, 1);
        registry.bindExecution(RECEIPT_ID, executionHash);
        assertEq(registry.getReceipt(RECEIPT_ID).executionTxHash, executionHash);
        vm.expectRevert(ActionReceiptRegistry.ExecutionAlreadyBound.selector);
        registry.bindExecution(RECEIPT_ID, executionHash);
    }

    function testBlockAndReviewCannotBindExecution() public {
        _anchor(RECEIPT_ID, 2);
        vm.expectRevert(ActionReceiptRegistry.ExecutionNotAllowed.selector);
        registry.bindExecution(RECEIPT_ID, keccak256("execution"));
    }

    function testOnlyOriginalSubmitterCanBind() public {
        _anchor(RECEIPT_ID, 1);
        vm.prank(address(0xBEEF));
        vm.expectRevert(ActionReceiptRegistry.NotReceiptSubmitter.selector);
        registry.bindExecution(RECEIPT_ID, keccak256("execution"));
    }

    function _anchor(bytes32 receiptId, uint8 verdict) internal {
        registry.anchorReceipt(receiptId, AGENT_ID, INTENT_HASH, ACTION_HASH, POLICY_HASH, EVIDENCE_HASH, verdict, REASON_HASH);
    }
}

