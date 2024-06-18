import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BigNumber, ethers } from "ethers";
import { useGlobalContext } from "@/context/Store";
import { polyweaveContract, provider, signer } from "@/constants/matic";
import { webWallet } from "@/constants/powe";
import { ArConnect } from "arweavekit/auth";
// import { useActiveAddress } from "arweave-wallet-kit";
// import { write } from "../../warp/read";
// import { fetchMaticPrice } from "../utils/Fetch";

export default function Swap() {
  const {
    nativeBalance,
    pstBalance,
    maticPrice,
    arUserAddress,
    setArUserAddress,
  } = useGlobalContext();

  const [inputNumber, setInputNumber] = useState(null);
  const [gasPrice, setGasPrice] = useState(0);
  const [selectedFunctionalOption, setSelectedFunctionalOption] = useState(1);

  const functionalOptions = [
    {
      id: 1,
      label: "MINT",
    },
    {
      id: 2,
      label: "REDEEM",
    },
    {
      id: 3,
      label: "CONTRIBUTE",
    },
  ];

  async function depositAmount(arAccount, amount) {
    try {
      const parsedValue = await ethers.utils.parseEther(amount);
      const trx = await polyweaveContract.depositAmount(arAccount, {
        value: parsedValue,
      });
      await trx;

      if (trx.status === true) {
        await mint(arAccount, parseInt(amount));
        if (!writeResult.result.status !== 200) {
          alert(
            `${amount} POWE not minted to ${arAccount}, adding to waitlist to approve later by Admin`
          );
        }
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  async function burn() {
    try {
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }
  async function contribute() {
    try {
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  async function fetchGasPrice() {
    try {
      const gasPriceWei = await provider.getGasPrice();
      const gasPriceGwei = ethers.utils.formatUnits(gasPriceWei, "gwei");
      return gasPriceGwei;
    } catch (error) {
      console.error("Error fetching gas price:", error);
      return null;
    }
  }

  const handleInputChange = (e) => {
    const _inputNumber = parseFloat(e.target.value);

    // Check if _inputNumber is NaN
    const inputNumberValue = isNaN(_inputNumber) ? 0 : _inputNumber;

    setInputNumber(inputNumberValue);
  };

  const resetInputs = () => {
    setInputNumber(0);
    // setOutputNumber(0);
  };

  const getWallet = async () => {
    // await ArConnect.connect("ACCESS_ADDRESS");
    const address = await window.arweaveWallet.getActiveAddress();
    setArUserAddress(address);
    // alert(`the address is ${address}`);
  };

  const handleClick = async () => {
    switch (selectedFunctionalOption) {
      case functionalOptions[0].id:
        await getWallet();
        // return;
        if (!arUserAddress || arUserAddress.length == 0) {
          alert("Install AR wallet first");
          return;
        }
        await depositAmount(arUserAddress, inputNumber);
        break;
      case functionalOptions[1].id:
        withdrawKnowledgeBurn(inputNumber);
        break;
    }
  };

  return (
    <div className="h-4/5 flex flex-col justify-center self-center">
      <div className="p-5 justify-center">
        <div className="mx-auto w-full max-w-lg rounded-lg bg-white drop-shadow-lg p-5 pt-10 xs:p-6 xs:pt-5">
          <div className="mb-5 border-b border-dashed border-gray-200 pb-5 xs:mb-7 xs:pb-6">
            <div className="relative rounded-md flex gap-3 flex-col w-full">
              <div className="flex gap-x-4 text-sm">
                {functionalOptions.map((option) => (
                  <span
                    className={`py-1 px-4 ${
                      selectedFunctionalOption === option.id
                        ? "bg-gray-800 text-white"
                        : "text-black bg-gray-200"
                    } rounded-lg uppercase cursor-pointer`}
                    key={option.id}
                    onClick={() => setSelectedFunctionalOption(option.id)}
                  >
                    {option.label}
                  </span>
                ))}
              </div>
              <div className="flex min-h-[70px] rounded-lg border border-gray-200 transition-colors duration-200 hover:border-gray-900">
                {selectedFunctionalOption === functionalOptions[0].id && (
                  <>
                    <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 hover:border-gray-900">
                      <span className="text-xs uppercase text-black text-center">
                        MATIC
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col text-right">
                      <input
                        type="number"
                        min={0}
                        // placeholder="Currency Amount"
                        name="inputNumber"
                        className="w-full rounded-br-lg rounded-tr-lg border-0 pb-0.5 pr-5 text-right text-lg outline-none focus:ring-0 bg-white placeholder:text-black text-black"
                        value={inputNumber}
                        onChange={handleInputChange}
                      />
                      {/* <span className="font-xs px-3 text-gray-400">
                        = $ {(parseFloat(maticPrice) || 0) * inputNumber}
                      </span> */}
                    </div>
                  </>
                )}{" "}
                {selectedFunctionalOption === functionalOptions[1].id && (
                  <>
                    <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 hover:border-gray-900">
                      <span className="text-xs uppercase text-black">POWE</span>
                    </div>
                    <div className="flex flex-1 flex-col text-right">
                      <input
                        type="number"
                        min={0}
                        // placeholder="Knowledge Amount"
                        name="inputNumber"
                        className="w-full rounded-br-lg rounded-tr-lg border-0 pb-0.5 pr-5 text-right text-lg outline-none focus:ring-0 bg-white placeholder:text-black text-black"
                        value={inputNumber}
                        onChange={handleInputChange}
                      />
                      {/* <span className="font-xs px-3 text-gray-400">
                        = $ {inputNumber * 1}
                      </span> */}
                    </div>
                  </>
                )}
                {selectedFunctionalOption === functionalOptions[2].id && (
                  <>
                    <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 hover:border-gray-900">
                      <span className="text-xs uppercase text-black">POWE</span>
                    </div>
                    <div className="flex flex-1 flex-col text-right">
                      <input
                        type="number"
                        min={0}
                        // placeholder="Knowledge Amount"
                        name="inputNumber"
                        className="w-full rounded-br-lg rounded-tr-lg border-0 pb-0.5 pr-5 text-right text-lg outline-none focus:ring-0 bg-white placeholder:text-black text-black"
                        value={inputNumber}
                        onChange={handleInputChange}
                      />
                      {/* <span className="font-xs px-3 text-gray-400">
                        = $ {inputNumber * 1}
                      </span> */}
                    </div>
                  </>
                )}
              </div>
              {selectedFunctionalOption !== functionalOptions[2].id && (
                <div className="mt-2 z-40 rounded-xl bg-white  absolute left-1/2 top-1/2">
                  ↕
                </div>
              )}
              <div
                className={`flex rounded-lg ${
                  selectedFunctionalOption === functionalOptions[2].id
                    ? ""
                    : "border border-gray-200 min-h-[70px]"
                } transition-colors duration-200 hover:border-gray-900`}
              >
                {selectedFunctionalOption === functionalOptions[1].id && (
                  <>
                    <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 hover:border-gray-900">
                      <span className="text-xs uppercase text-black">
                        MATIC
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col text-right">
                      <input
                        type="number"
                        // placeholder="Currency Redeeming..."
                        className="w-full rounded-br-lg rounded-tr-lg border-0 pb-0.5 pr-5 text-right text-lg outline-none focus:ring-0 bg-white placeholder:text-black text-black"
                        value={inputNumber}
                        disabled={
                          selectedFunctionalOption === functionalOptions[1].id
                        }
                      />
                      {/* <span className="font-xs px-3 text-gray-400">
                        = ${(parseFloat(maticPrice) || 0) * outputNumber}
                      </span> */}
                    </div>
                  </>
                )}
                {selectedFunctionalOption === functionalOptions[0].id && (
                  <>
                    <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 hover:border-gray-900">
                      <span className="text-xs uppercase text-black">POWE</span>
                    </div>
                    <div className="flex flex-1 flex-col text-right">
                      <input
                        type="number"
                        // placeholder="Knowledge Minting..."
                        className="w-full rounded-br-lg rounded-tr-lg border-0 pb-0.5 pr-5 text-right text-lg outline-none focus:ring-0 bg-white placeholder:text-black text-black"
                        value={inputNumber}
                        disabled={
                          selectedFunctionalOption === functionalOptions[0].id
                        }
                      />
                      {/* <span className="font-xs px-3 text-gray-400">= $</span> */}
                    </div>
                  </>
                )}
                {selectedFunctionalOption === functionalOptions[2].id && (
                  <div className="flex gap-x-2">
                    <p className="text-green-500 text-xs">
                      NOTE: The Contribution of more than 20 POWE ~ 20 Matic
                      will be burned and never reversed. This contribution will
                      lead to you earn a Soul Bound Token ~ NFT which gives you
                      to upgrade VIP level
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 xs:gap-[18px]">
            {(selectedFunctionalOption === functionalOptions[0].id ||
              selectedFunctionalOption === functionalOptions[1].id) && (
              <div className="flex items-center text-black justify-between ">
                <span className="font-medium text-sm">Rate</span>
                <span className="font-medium">
                  {selectedFunctionalOption === functionalOptions[1].id
                    ? `1 POWE   ≈ ${1} MATIC`
                    : selectedFunctionalOption === functionalOptions[0].id
                    ? `1 MATIC ≈ ${1} POWE`
                    : ""}
                </span>
              </div>
            )}
            <div className="flex items-center text-black justify-between ">
              <span className="font-medium text-sm">Network Fee</span>
              <span className="font-medium">{gasPrice}</span>
            </div>
            <div className="flex items-center text-black justify-between ">
              <span className="font-medium text-sm">Slippage</span>
              <span className="font-medium"> 1%</span>
            </div>
          </div>
          <button
            onClick={handleClick}
            className={`uppercase w-full text-sm rounded-lg mt-6 p-4 
                bg-gray-800 text-white`}
          >
            {selectedFunctionalOption === functionalOptions[0].id
              ? "Mint"
              : selectedFunctionalOption === functionalOptions[1].id
              ? "Redeem"
              : "Burn"}
          </button>
        </div>
      </div>
    </div>
  );
}
