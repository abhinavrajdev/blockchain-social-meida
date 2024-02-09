async function isConnected() {
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  if (accounts.length) {
    return true;
  } else {
    return false;
  }
}

export default isConnected;
