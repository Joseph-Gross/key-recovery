pragma solidity ^0.8.0;

import "./ECDSA.sol";

/**
 * The Keycovery database contract.
 */
contract Keycovery {

  /**
   * Mapping from account address to its initialized friend list
   */
  mapping (address => mapping(address => bool)) private friends;

  /**
   * Number of friends an account has.
   */
  mapping (address => uint256) private friendCount;

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
  mapping (address => bool) public seenSigners;

  bool public isPaused;
  address public admin;

  constructor() {
    isPaused = false;
    admin = msg.sender;
  }

  modifier notPaused() { 
    require(!isPaused); 
    _; 
  }
  
  /**
   * Initialize an account (msg.sender) with an array of friends
   */
  function initializeWalletFriends(address[] memory friendArray) external notPaused {
    for (uint i = 0; i < friendArray.length; i++) {
      friends[msg.sender][friendArray[i]] = true;
    }

    friendCount[msg.sender] = friendArray.length;
  }
  
  /**
   * Getter for if an address is authorized to recover the private key
   */
  function isAuthorizedRecoverer(address lost, address recoverer) external view notPaused returns (bool) {
    return approvedRecoverer[lost] == recoverer;
  }

  /**
   * Approve a recoverer to access the "lost" wallet's private key. Needs signatures from all friends.
   * Returns true on success, false otherwise.
   */
  function approveRecoverer(address lost, address recoverer, uint256 nonce, bytes[] calldata signatures) external notPaused returns (bool) {

    if (nonce != recoveryCount[lost]) {
      return false;
    }

    if (friendCount[lost] != signatures.length) {
      return false;
    }

    bytes32 messageHash = keccak256(
      abi.encode(lost, recoverer, nonce)
    );

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
    recoveryCount[lost] += 1;

    return true;
  }

  function pause() external {
    require(msg.sender == admin);
    isPaused = true;
  }
}

