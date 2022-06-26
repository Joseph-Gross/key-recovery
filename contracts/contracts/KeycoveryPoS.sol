// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ECDSA.sol";
import "./worldcoin/world-id/interfaces/IWorldID.sol";
import "./worldcoin/world-id/libraries/ByteHasher.sol";

/**
 * The Keycovery database contract.
 */
contract KeycoveryPoS {

  using ByteHasher for bytes;

  error InvalidNullifier();

  /**
   * Mapping from account address to its initialized friend list
   */
  mapping (address => mapping(address => bool)) private friends;

  /**
   * Number of friends an account has.
   */
  mapping (address => uint256) public friendCount;

  /**
   * Mapping from an account address to it's approved recoverer address
   */
  mapping (address => address) private approvedRecoverer;

  /**
   * Nonce counter
   */
  mapping (address => uint256) public recoveryNonce;

  /**
   * Seen signers
   */
  uint256 public nullifierHash;

  address immutable public actionID;

  bool public isPaused;
  address public admin;

  event RecovererVerified(address indexed recoverer);


  uint256 internal immutable groupId;
  IWorldID internal immutable worldId;

  event InitializedFriends(address[] friends);

  constructor(IWorldID worldId_, uint256 groupId, address signal, uint256 root, uint256 _nullifierHash, uint256[8] calldata proof, address[] memory friendArray) payable {
    worldId_.verifyProof(
        root,
        groupId,
        abi.encodePacked(signal).hashToField(),
        nullifierHash,
        abi.encodePacked(address(this)).hashToField(),
        proof
    );

    nullifierHash = _nullifierHash;

    for (uint i = 0; i < friendArray.length; i++) {
      friends[msg.sender][friendArray[i]] = true;
    }

    friendCount[msg.sender] = friendArray.length;

    emit InitializedFriends(friendArray);
  }

  
  /**
   * Getter for if an address is authorized to recover the private key
   */
  function isAuthorizedRecoverer(address lost, address recoverer) external view returns (bool) {
    return approvedRecoverer[lost] == recoverer;
  }

  /**
   * Approve a recoverer to access the "lost" wallet's private key. Needs signatures from all friends.
   * Returns true on success, false otherwise.
   */
  function approveRecoverer(
    address lost,
    address recoverer,
    uint256 nonce,
    bytes[] calldata signatures,
    uint256 root,
    uint256 nullifierHash_,
    uint256[8] calldata proof) external returns (bool) {

    if (nullifierHash_ != nullifierHash) {
      revert InvalidNullifier();
    }

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

