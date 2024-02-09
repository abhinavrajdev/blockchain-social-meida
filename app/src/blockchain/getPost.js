import { contractAddress, abi } from "./ContractInfo";

async function getPost(index) {
  const provider = new window.ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const contract = new window.ethers.Contract(contractAddress, abi, provider);

  try {
    const variableValue = await contract.postIndexSort(index); // Replace with the actual function name
    return variableValue;
  } catch (error) {
    console.error("Error fetching variable value:", error);
  }
}

export default getPost;
