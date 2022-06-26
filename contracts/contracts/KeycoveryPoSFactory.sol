
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

  mapp
  /**
   * Nullifier hash
   */
  uint256 constant public nullifierHash;

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
  
  event InitializedFriends(address[] friends);

  /**
   * Initialize an account (msg.sender) with an array of friends
   */
  function initializeWalletFriends(address[] memory friendArray) external notPaused {
    for (uint i = 0; i < friendArray.length; i++) {
      friends[msg.sender][friendArray[i]] = true;
    }

    friendCount[msg.sender] = friendArray.length;

    emit InitializedFriends(friendArray);
  }

  /**
   * Approve a recoverer to access the "lost" wallet's private key. Needs signatures from all friends.
   * Returns true on success, false otherwise.
   */
  function deployKeykoInstance(
    address signal
    uint256 root,
    uint256 nullifierHash,
    uint256[8] calldata proof) external returns (bool) {

    worldId.verifyProof(
        root,
        groupId,
        abi.encodePacked(lost).hashToField(),
        nullifierHash,
        abi.encodePacked(address(this)).hashToField(),
        proof
    );

    nullifierHashes[nullifierHash] += 1;

    if(nullifierHashes[nullifierHash] == verificationLimit) {
      revert InvalidNullifier();
    }

    require(isVerified[recoverer]);
    require(nonce == recoveryNonce[lost]);
    require(friendCount[lost] == signatures.length);

    bytes32 hash = keccak256(
      abi.encode(lost, recoverer, nonce)
    );

    bytes32 messageHash = ECDSA.toEthSignedMessageHash(hash);

    address[] memory seenFriends = new address[](friendCount[lost]);

    // Check that each friend has signed the message.
    for(uint i = 0; i < friendCount[lost]; i++) {
      address signer = ECDSA.recover(messageHash, signatures[i]);
      require(!seenSigners[signer]);
      require(friends[lost][signer]);
      seenSigners[signer] = true;
      seenFriends[i] = signer;
    }

    // Reset seen signers list.
    for(uint i = 0; i < friendCount[lost]; i++) {
      address friend = seenFriends[i];
      seenSigners[friend] = false;
    }

    approvedRecoverer[lost] = recoverer;
    recoveryNonce[lost] += 1;

    return true;
  }

}

