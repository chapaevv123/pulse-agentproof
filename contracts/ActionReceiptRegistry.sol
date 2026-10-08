// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title ActionReceiptRegistry
/// @notice Compact, immutable accountability anchors for deterministic agent-action verdicts.
contract ActionReceiptRegistry {
    enum Verdict {
        NONE,
        ALLOW,
        BLOCK,
        REVIEW
    }

    struct ReceiptAnchor {
        bytes32 agentId;
        bytes32 intentHash;
        bytes32 actionHash;
        bytes32 policyHash;
        bytes32 evidenceHash;
        bytes32 reasonCodeHash;
        bytes32 executionTxHash;
        address submitter;
        uint64 blockNumber;
        uint64 timestamp;
        Verdict verdict;
    }

    error EmptyReceiptId();
    error EmptyAgentId();
    error InvalidVerdict();
    error ReceiptAlreadyExists(bytes32 receiptId);
    error ReceiptNotFound(bytes32 receiptId);
    error NotReceiptSubmitter();
    error ExecutionNotAllowed();
    error ExecutionAlreadyBound();
    error EmptyExecutionTxHash();

    mapping(bytes32 receiptId => ReceiptAnchor) private receipts;

    event ActionReceiptAnchored(
        bytes32 indexed receiptId,
        bytes32 indexed agentId,
        bytes32 actionHash,
        uint8 verdict,
        bytes32 reasonCodeHash
    );

    event ExecutionBound(bytes32 indexed receiptId, bytes32 indexed executionTxHash);

    function anchorReceipt(
        bytes32 receiptId,
        bytes32 agentId,
        bytes32 intentHash,
        bytes32 actionHash,
        bytes32 policyHash,
        bytes32 evidenceHash,
        uint8 verdict,
        bytes32 reasonCodeHash
    ) external {
        if (receiptId == bytes32(0)) revert EmptyReceiptId();
        if (agentId == bytes32(0)) revert EmptyAgentId();
        if (verdict < uint8(Verdict.ALLOW) || verdict > uint8(Verdict.REVIEW)) revert InvalidVerdict();
        if (receipts[receiptId].timestamp != 0) revert ReceiptAlreadyExists(receiptId);

        receipts[receiptId] = ReceiptAnchor({
            agentId: agentId,
            intentHash: intentHash,
            actionHash: actionHash,
            policyHash: policyHash,
            evidenceHash: evidenceHash,
            reasonCodeHash: reasonCodeHash,
            executionTxHash: bytes32(0),
            submitter: msg.sender,
            blockNumber: uint64(block.number),
            timestamp: uint64(block.timestamp),
            verdict: Verdict(verdict)
        });

        emit ActionReceiptAnchored(receiptId, agentId, actionHash, verdict, reasonCodeHash);
    }

    function bindExecution(bytes32 receiptId, bytes32 executionTxHash) external {
        ReceiptAnchor storage receipt = receipts[receiptId];
        if (receipt.timestamp == 0) revert ReceiptNotFound(receiptId);
        if (msg.sender != receipt.submitter) revert NotReceiptSubmitter();
        if (receipt.verdict != Verdict.ALLOW) revert ExecutionNotAllowed();
        if (receipt.executionTxHash != bytes32(0)) revert ExecutionAlreadyBound();
        if (executionTxHash == bytes32(0)) revert EmptyExecutionTxHash();
        receipt.executionTxHash = executionTxHash;
        emit ExecutionBound(receiptId, executionTxHash);
    }

    function getReceipt(bytes32 receiptId) external view returns (ReceiptAnchor memory) {
        ReceiptAnchor memory receipt = receipts[receiptId];
        if (receipt.timestamp == 0) revert ReceiptNotFound(receiptId);
        return receipt;
    }
}

