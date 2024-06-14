import { ethers } from "ethers";
export const MQART_ADDRESS = "";

export const MQART_ABI = [];

export const initializeProvider = () => {
  if (typeof window === "undefined") {
    console.warn(
      "initializeProvider: Window object not available on the server."
    );
    return null;
  }

  const windowWithEthereum = window;

  if (windowWithEthereum.ethereum) {
    return new ethers.providers.Web3Provider(windowWithEthereum.ethereum);
  } else {
    console.warn("initializeProvider: Web3Provider not available.");
    return null;
  }
};

export const provider =
  typeof window !== "undefined" ? initializeProvider() : null;
export const signer = provider ? provider.getSigner() : null;

export const mQartContractWithSigner = signer
  ? new ethers.Contract(MQART_ADDRESS, MQART_ABI, signer)
  : null;
export const mQartContractWithProvider = provider
  ? new ethers.Contract(MQART_ADDRESS, MQART_ABI, provider)
  : null;

export const vaultContract = mQartContractWithSigner?.connect(signer);
