const web3 = new window.Web3(window.ethereum); // Connect to MetaMask's provider

async function getTotalTransactionCount() {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = await accounts[0];

    const transactionCount = await web3.eth.getTransactionCount(account);
    console.log(`Total transaction count: ${transactionCount}`);
    return transactionCount;
  } catch (error) {
    console.error("Error accessing MetaMask:", error);
  }
}

export default getTotalTransactionCount;
