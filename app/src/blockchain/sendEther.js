async function sendEther(recipientAddress, amountInEther) {
  try {
    const provider = new window.ethers.providers.Web3Provider(window.ethereum);

    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const tx = await signer.sendTransaction({
      to: recipientAddress,
      value: window.ethers.utils.parseUnits(amountInEther, "ether"),
    });

    console.log("Transaction hash:", tx.hash);
  } catch (error) {
    console.error("Error:", error);
  }
}

export default sendEther;
