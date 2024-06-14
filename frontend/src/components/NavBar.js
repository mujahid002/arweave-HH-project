import Image from "next/image";
import Link from "next/link";
import { useGlobalContext } from "../context/Store";
import { useEffect } from "react";
import { ethers } from "ethers";
import { provider } from "../constants/index";

export default function NavBar() {
  const {
    userAddress,
    nativeBalance,
    PSTBalance,
    maticPrice,
    setUserAddress,
    setNativeBalance,
    setPSTBalance,
  } = useGlobalContext();

  const ConnectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error(
          "Your browser doesn't seem to support connecting to Ethereum wallets. Please consider using a compatible browser like Chrome, Firefox, or Brave with a wallet extension like MetaMask."
        );
      }

      const ethereum = window.ethereum;
      const provider = new ethers.providers.Web3Provider(ethereum);

      await checkNetwork(provider);

      // If already on the correct network or after switching
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      // Handle user rejection
      if (accounts.length === 0) {
        console.log("User rejected account connection.");
        return;
      }

      const [address] = accounts;
      setUserAddress(address);

      // Fetch the native balance (ETH)
      const nativeBalance = await provider.getBalance(address);
      setNativeBalance(ethers.utils.formatEther(nativeBalance)); // Assuming setNativeBalance expects a string

      // Fetch the token balance if necessary
      if (address) {
        await getPSTBalance(address);
      }

      // Subscribe to account changes
      ethereum.on("accountsChanged", async (newAccounts) => {
        const newAddress = newAccounts.length > 0 ? newAccounts[0] : "";
        setUserAddress(newAddress); // Update address in your application
        console.log("Account changed, new address:", newAddress);

        // Update balances on account change
        if (newAddress) {
          const newNativeBalance = await provider.getBalance(newAddress);
          setNativeBalance(ethers.utils.formatEther(newNativeBalance));
          if (newAddress) {
            await getPSTBalance(newAddress);
          }
        } else {
          setNativeBalance("0");
          setPSTBalance("0");
        }
      });

      if (address) {
        await getPSTBalance(address);
      }
    } catch (error) {
      console.error("Install metamask OR unable to call", error);
    }
  };

  const checkNetwork = async (provider) => {
    try {
      const network = await provider.getNetwork();

      const isAmoyNetwork = network.chainId === 80002;
      if (!isAmoyNetwork) {
        alert(`Change your network to Amoy Testnet`);
      }
    } catch (error) {
      console.error("Unable to call checkNetwork function", error);
    }
  };

  useEffect(() => {
    ConnectWallet();
  }, [userAddress]);
  return (
    <nav className="py-5 px-12 flex justify-between items-center">
      <Link href="/">
        <p className="bg-white text-3xl font-bold underline underline-offset-4 decoration-wavy decoration-2 decoration-purple-500 cursor-pointer">
          {"MATIC<->PST"}
        </p>
      </Link>
      {userAddress && userAddress.length > 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-purple-500">{userAddress}</p>
          <div className="flex gap-4 items-center justify-center">
            <p className="text-purple-500">
              {nativeBalance
                ? "MATIC: " +
                  parseFloat(nativeBalance).toFixed(2) +
                  `(~$${(maticPrice * parseFloat(nativeBalance)).toFixed(2)})`
                : "Loading..."}
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={ConnectWallet}
          className="bg-purple-50 hover:bg-purple-500 hover:text-white transition-colors duration-500 text-purple-500 rounded-md px-5 py-2"
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
}
