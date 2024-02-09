async function getPublicAddress() {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const publicAddress = accounts[0]; // Use the first connected account's address

    console.log(`Public wallet address: ${publicAddress}`);
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x5",
          rpcUrls: ["https://rpc.goerli.eth.gateway.fm"],
          chainName: "Goerli test network",
          nativeCurrency: {
            name: "GoerliETH",
            symbol: "ETH",
            decimals: 18,
          },
          blockExplorerUrls: ["https://polygonscan.com/"],
        },
      ],
    });

    return publicAddress;
  } catch (error) {
    console.error("Error accessing MetaMask:", error);
  }
}

export default getPublicAddress;
