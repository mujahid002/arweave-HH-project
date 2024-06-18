import { ethers } from "ethers";
export const POLYWEAVE_ADDRESS = "";

export const POLYWEAVE_ABI = [];

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

export const polyweaveContractWithSigner = signer
  ? new ethers.Contract(POLYWEAVE_ADDRESS, POLYWEAVE_ABI, signer)
  : null;
export const polyweaveContractWithProvider = provider
  ? new ethers.Contract(POLYWEAVE_ADDRESS, POLYWEAVE_ABI, provider)
  : null;

export const polyweaveContract = polyweaveContractWithSigner?.connect(signer);

export const adminWallet = new ethers.Wallet(
  `${process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY}`,
  provider
);

// Admin functions

export async function withdrawAmount(userAddress, arAccount, amount) {
  try {
    const trx = await polyweaveContract.withdrawAmount(
      userAddress,
      arAccount,
      amount
    );
    await trx;
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}
export async function contributeAmount() {
  try {
    const trx = await polyweaveContract.withdrawAmount(
      userAddress,
      arAccount,
      amount
    );
    await trx;
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}
