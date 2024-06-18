import Link from "next/link";
import { useGlobalContext } from "../context/Store";
import { useEffect } from "react";
import { ethers } from "ethers";
import { ArConnect } from "arweavekit/auth";
import {
  ArweaveWalletKit,
  ConnectButton,
  useConnection,
} from "arweave-wallet-kit";

import { fetchMaticPrice } from "@/utils/Fetch";

export default function NavBar() {
  const { connected, connect, disconnect } = useConnection();
  const {
    userAddress,
    arUserAddress,
    nativeBalance,
    maticPrice,
    setUserAddress,
    setNativeBalance,
    setArUserAddress,
  } = useGlobalContext();

  const arConnectWallet = async () => {
    try {
      // const address = await ArConnect.getActiveAddress();
      const response = await ArConnect.isInstalled();

      console.log("ArConnect Wallet installed:", response);
      if (!response) {
        alert("Please install Arweave Wallet!");
      }

      // connect to the extension
      // await window.arweaveWallet.connect(
      //   // request permissions to read the active address
      //   ["ACCESS_ADDRESS"]
      // );
      await connect(["ACCESS_ADDRESS"]);
      const address = useActiveAddress();
      // await ArConnect.connect(["ACCESS_ADDRESS"]);
      // const address = await ArConnect.getActiveAddress();
      setArUserAddress(address);
    } catch (e) {
      console.error("Error:", e.message || e);
      alert("Please install the Arweave Wallet.");
    }
  };

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
      // if (address) {
      //   await getPSTBalance(address);
      // }

      // Subscribe to account changes
      ethereum.on("accountsChanged", async (newAccounts) => {
        const newAddress = newAccounts.length > 0 ? newAccounts[0] : "";
        setUserAddress(newAddress); // Update address in your application
        console.log("Account changed, new address:", newAddress);

        // Update balances on account change
        if (newAddress) {
          const newNativeBalance = await provider.getBalance(newAddress);
          setNativeBalance(ethers.utils.formatEther(newNativeBalance));
        } else {
          setNativeBalance("0");
        }
        // await fetchMaticPrice();
      });
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
    // fetchMaticPrice();
    // arConnectWallet();
  }, [userAddress]);
  return (
    <ArweaveWalletKit>
      <nav className="py-5 px-12 flex justify-between items-center">
        <Link href="/">
          <p className="bg-white text-3xl font-bold underline underline-offset-4 decoration-wavy decoration-2 decoration-purple-500 cursor-pointer">
            {"Polyweave"}
          </p>
        </Link>
        {/* {arUserAddress && arUserAddress.length > 0 ? (
          <div className="flex flex-col items-center">
            <p className="text-purple-500">{arUserAddress}</p>
            <div className="flex gap-4 items-center justify-center">
            </div>
          </div>
        ) : (
          <button
            className="bg-purple-50 hover:bg-purple-500 hover:text-white transition-colors duration-500 text-purple-500 rounded-md px-5 py-2"
          >
            {connected ? "con" : "arUserAddress"}
          </button>
        )} */}
        <ConnectButton
          accent="rgb(173, 82, 242)"
          profileModal={true}
          showBalance={true}
          showProfilePicture={true}
          useAns={true}
        />
        {userAddress && userAddress.length > 0 ? (
          <div className="flex flex-col items-center">
            <p className="text-purple-500">{userAddress}</p>
            <div className="flex gap-4 items-center justify-center">
              <p className="text-purple-500">
                {nativeBalance
                  ? "MATIC: " + parseFloat(nativeBalance).toFixed(2)
                  : // + `(~$${(maticPrice * parseFloat(nativeBalance)).toFixed(2)})`
                    "Loading..."}
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={ConnectWallet}
            className="bg-purple-50 hover:bg-purple-500 hover:text-white transition-colors duration-500 text-purple-500 rounded-md px-5 py-2"
          >
            Connect Metamask
          </button>
        )}
      </nav>
    </ArweaveWalletKit>
  );
}
