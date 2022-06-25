export function generateAccessControlConditions(keycoveryContractAddress, lostWalletAddress, chain) {
  return [
    {
      conditionType: "evmContract",
      contractAddress: keycoveryContractAddress,
      functionName: "isAuthorizedRecoverer",
      functionParams: [lostWalletAddress, ":userAddress"],
      functionAbi: {
        inputs: [
          {
            internalType: "address",
            name: "lost",
            type: "address",
          },
          {
            internalType: "address",
            name: "recoverer",
            type: "address"
          }
        ],
        name: "verify",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      chain,
      returnValueTest: {
        comparator: "=",
        value: "true",
      },
    }
  ];
}
