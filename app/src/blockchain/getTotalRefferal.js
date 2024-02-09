import { contractAddress, abi } from "./ContractInfo";

async function getReffEarning(userAddr) {
  const provider = new window.ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const contract = new window.ethers.Contract(contractAddress, abi, provider);

  try {
    console.log("try block");
    const variableValue = await contract.reffEarning(userAddr); // Replace with the actual function name
    console.log("Reff  value:", variableValue);
    return variableValue;
  } catch (error) {
    console.error("Error fetching variable value:", error);
  }
}

export default getReffEarning;
