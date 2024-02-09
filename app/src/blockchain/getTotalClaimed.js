import { contractAddress, abi } from "./ContractInfo";

async function getTotalClaimed() {
  const provider = new window.ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const contract = new window.ethers.Contract(contractAddress, abi, provider);

  try {
    console.log("try block");
    const variableValue = await contract.total(); // Replace with the actual function name
    console.log("total value:", variableValue);
    return variableValue;
  } catch (error) {
    console.error("Error fetching variable value:", error);
  }
}

export default getTotalClaimed;
