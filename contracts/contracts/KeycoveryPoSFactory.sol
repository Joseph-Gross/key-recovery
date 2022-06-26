
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ECDSA.sol";
import "./worldcoin/world-id/interfaces/IWorldID.sol";
import "./worldcoin/world-id/libraries/ByteHasher.sol";
import "./KeycoveryPoS.sol";

/**
 * The Keycovery database contract.
 */
contract KeycoveryPoSFactory {

  using ByteHasher for bytes;

  mapping(address => KeycoveryPoS) public proxies;

  /**
   * Seen signers
   */
  mapping (uint256 => bool) public nullifierHashes;

  bool public isPaused;
  address public admin;

  event RecovererVerified(address indexed recoverer);

  uint256 internal immutable groupId;
  IWorldID internal immutable worldId;

  constructor(IWorldID _worldId, uint256 _groupId) payable {
    worldId = _worldId;
    groupId = _groupId;
    admin = msg.sender;
    isPaused = false;
  }

  modifier notPaused() { 
    require(!isPaused); 
    _; 
  }
  
  /**
   * Approve a recoverer to access the "lost" wallet's private key. Needs signatures from all friends.
   * Returns true on success, false otherwise.
   */
  function deployKeykoInstance(
    address signal,
    uint256 root,
    uint256 nullifierHash,
    uint256[8] calldata proof,
    address[] memory friendArray) external returns (address) {

    worldId.verifyProof(
        root,
        groupId,
        abi.encodePacked(lost).hashToField(),
        nullifierHash,
        abi.encodePacked(address(this)).hashToField(),
        proof
    );

    nullifierHashes[nullifierHash] = true;

    KeycoveryPoS instance = new KeycoveryPoSFactory(worldId, groupId, msg.sender, root, nullifierHash, proof, friendArray);

    return address(instance);

  }

}

