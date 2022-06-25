// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { ByteHasher } from './worldcoin/world-id/libraries/ByteHasher.sol';
import { IWorldID } from './worldcoin/world-id/interfaces/IWorldID.sol';

contract HumanCheck {
    using ByteHasher for bytes;

    error InvalidNullifier();

    event RecovererVerified(address indexed recoverer);

    uint256 internal immutable groupId;
    IWorldID internal immutable worldId;

    mapping(address => bool) public isVerified;

    constructor(IWorldID _worldId, uint256 _groupId) payable {
        worldId = _worldId;
        groupId = _groupId;
    }

    function verify(
        address recoverer,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public payable {
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(recoverer).hashToField(),
            nullifierHash,
            abi.encodePacked("VerifyHuman").hashToField(),
            proof
        );

        isVerified[recoverer] = true;

        emit RecovererVerified(recoverer);
    }
}