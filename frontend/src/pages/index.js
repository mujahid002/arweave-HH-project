import * as React from "react";
import Swapicon from "../images/swap.svg";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BigNumber, ethers } from "ethers";
import { useGlobalContext } from "@/context/Store";
import { provider, signer, vaultContract } from "@/constants/Constants";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function Swap() {
  const {
    nativeBalance,
    PSTBalance,
    // currencyValueInEuro,
    // setCurrencyValueInEuro,
  } = useGlobalContext();

  const currencyValueInEuro = 0;
  const setCurrencyValueInEuro = 0;

  const [inputNumber, setInputNumber] = useState(0);
  const [outputNumber, setOutputNumber] = useState(0);
  const [knowledgePerInputCurrency, setKnowledgePerInputCurrency] = useState(0);
  const [outputKnowledgeForUnitCurrency, setOutputKnowledgeForUnitCurrency] =
    useState(0);
  const [knowledgeValueInEuro, setKnowledgeValueInEuro] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  const [selectedFunctionalOption, setSelectedFunctionalOption] = useState(1);

  const functionalOptions = [
    {
      id: 1,
      label: "MINT",
      // actionMethod: function to mint knowledge
    },
    {
      id: 2,
      label: "REDEEM",
      // actionMethod: function to redeem knowledge
    },
    {
      id: 3,
      label: "BURN",
      // actionMethod: function to burn knowledge
    },
  ];

  async function initiateKnowledgeMint(currencyAmount) {
    try {
      console.log("value is", currencyAmount);
      console.log("contractWithSigner is", knowledgeEngineContract);
      const contractWithSigner = knowledgeEngineContract?.connect(signer);

      const parsedValue = ethers.utils.parseEther(`${currencyAmount}`);
      console.log("Parsed Value:", parsedValue.toString());

      const transaction = await contractWithSigner?.initiateKnowledgeMint({
        value: parsedValue.toString(),
        gasLimit: 500000,
      });

      // Wait for the transaction to be mined
      await transaction.wait();

      console.log("Transaction successful!");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  async function withdrawKnowledgeBurn(knowledgeAmount) {
    try {
      const contractWithSigner = knowledgeEngineContract?.connect(signer);

      // Use parseUnits to convert from Ether to Wei
      const parsedValue = ethers.utils.parseUnits(
        knowledgeAmount.toString(),
        18
      ); // Assuming 18 decimal places for Ether
      console.log(
        "Parsed Value in withdrawKnowledgeBurn:",
        parsedValue.toString()
      );

      const transaction = await contractWithSigner?.redeemKnowledge(
        parsedValue,
        {
          gasLimit: 800000, // Increase the gas limit
        }
      );

      // Wait for the transaction to be mined
      await transaction.wait();

      console.log("Transaction successful!");
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

  useEffect(() => {
    // Call the function initially
    fetchKnowledgePrice();

    // Fetch gas price when the component mounts
    fetchAndSetGasPrice();

    // Call the function initially
    // fetchScaledEuroAmount(1);

    // Fetches the output knowledge for 1 unit of currency
    fetchOutputKnowledgeForUnitCurrency();

    // Fetches the currency value in euro
    fetchCurrencyValueInEuro();

    // Set up an interval to call the function every 5 seconds
    const intervalId = setInterval(() => {
      console.log("Calling fetchKnowledgePrice...");
      fetchKnowledgePrice();
      fetchCurrencyValueInEuro();
    }, 5000);

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
      console.log("Interval cleared.");
    };
  }, []);

  useEffect(() => {
    setKnowledgeValueInEuro(fetchKnowledgeValueInEuro(outputNumber) || 0);
  }, [outputNumber]);

  async function fetchAndSetGasPrice() {
    const fetchedGasPrice = await fetchGasPrice();
    setGasPrice(fetchedGasPrice);
  }

  // Define the function to fetch knowledge price
  async function fetchKnowledgePrice() {
    try {
      const knowledgePrice =
        await priceDerivationContract?.calculateCurrentKnowledgePrice();

      // Log the fetched knowledge price
      console.log("Fetched knowledge price:", knowledgePrice);

      // Update state with the fetched knowledge price using the functional form of setKnowledgePerInputCurrency
      setKnowledgePerInputCurrency(
        parseFloat(
          parseFloat(ethers.utils.formatEther(knowledgePrice)).toFixed(4)
        )
      );

      console.log("Transaction successful!");
    } catch (error) {
      console.error("Transaction failed in Fetching knowledge price:", error);
    }
  }

  const fetchOutputKnowledgeForUnitCurrency = async () => {
    try {
      const scaledCurrencyEuroAmount =
        await priceDerivationContract?.getScaledCurrencyEuroAmount(
          ethers.utils.parseEther("1")
        );
      const tokensToMint = await knowledgeEngineContract?.getTokensToMint(
        scaledCurrencyEuroAmount
      );
      // @ts-ignore
      setOutputKnowledgeForUnitCurrency(ethers.utils.formatEther(tokensToMint));
    } catch (error) {
      console.error("Error fetching outputKnowledgeForUnitCurrency:", error);
    }
  };

  const fetchCurrencyValueInEuro = async () => {
    try {
      const scaledCurrencyEuroAmount =
        await priceDerivationContract?.getScaledCurrencyEuroAmount(
          ethers.utils.parseEther("1")
        );
      console.log(
        "scaledCurrencyEuroAmount is ...",
        scaledCurrencyEuroAmount.toString()
      );
      setCurrencyValueInEuro(
        // @ts-ignore
        ethers.utils.formatEther(scaledCurrencyEuroAmount).toString()
      );
    } catch (error) {
      console.error("Error fetching currencyValueInEuro:", error);
    }
  };

  const fetchKnowledgeValueInEuro = (_outputNumber) => {
    try {
      return knowledgePerInputCurrency * _outputNumber;
    } catch (error) {}
  };

  const handleInputChange = () => {
    switch (e.target.name) {
      case "inputNumber":
        const _inputNumber = parseFloat(e.target.value);

        // Check if _inputNumber is NaN
        const inputNumberValue = isNaN(_inputNumber) ? 0 : _inputNumber;

        setInputNumber(inputNumberValue);

        if (selectedFunctionalOption === functionalOptions[1].id) {
          // the user is trying to redeem knowledge
          setOutputNumber(
            parseFloat(
              (inputNumberValue / outputKnowledgeForUnitCurrency).toFixed(4)
            )
          );
        } else if (selectedFunctionalOption === functionalOptions[0].id) {
          // the user is trying to mint knowledge
          setOutputNumber(
            parseFloat(
              (inputNumberValue * outputKnowledgeForUnitCurrency).toFixed(4)
            )
          );
        }
        break;
      default:
        break;
    }
  };

  const hasEnoughTokens = () => {
    if (selectedFunctionalOption === functionalOptions[0].id) {
      return parseFloat(nativeBalance) >= inputNumber;
    } else if (selectedFunctionalOption === functionalOptions[1].id) {
      // Assuming initiateKnowledgeMint and withdrawKnowledgeBurn are functions that handle the token swaps
      return parseFloat(PSTBalance) >= inputNumber;
    }
  };

  const resetInputs = () => {
    setInputNumber(0);
    setOutputNumber(0);
  };

  const handleClick = () => {
    switch (selectedFunctionalOption) {
      case functionalOptions[0].id:
        initiateKnowledgeMint(inputNumber);
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
                        // min={0}
                        // placeholder="Currency Amount"
                        name="inputNumber"
                        className="w-full rounded-br-lg rounded-tr-lg border-0 pb-0.5 pr-5 text-right text-lg outline-none focus:ring-0 bg-white placeholder:text-black text-black"
                        value={inputNumber}
                        onChange={handleInputChange}
                      />
                      <span className="font-xs px-3 text-gray-400">
                        = €{" "}
                        {(parseFloat(currencyValueInEuro) || 0) * inputNumber}
                      </span>
                    </div>
                  </>
                )}{" "}
                {selectedFunctionalOption === functionalOptions[1].id && (
                  <>
                    <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 hover:border-gray-900">
                      <span className="text-xs uppercase text-black">
                        KNOWLEDGE
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col text-right">
                      <input
                        type="number"
                        // placeholder="Knowledge Amount"
                        name="inputNumber"
                        className="w-full rounded-br-lg rounded-tr-lg border-0 pb-0.5 pr-5 text-right text-lg outline-none focus:ring-0 bg-white placeholder:text-black text-black"
                        value={inputNumber}
                        onChange={handleInputChange}
                      />
                      <span className="font-xs px-3 text-gray-400">
                        = € {inputNumber * knowledgePerInputCurrency}
                      </span>
                    </div>
                  </>
                )}
                {selectedFunctionalOption === functionalOptions[2].id && (
                  <>
                    <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 hover:border-gray-900">
                      <span className="text-xs uppercase text-black">
                        KNOWLEDGE
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col text-right">
                      <input
                        type="number"
                        // placeholder="Knowledge Amount"
                        name="inputNumber"
                        className="w-full rounded-br-lg rounded-tr-lg border-0 pb-0.5 pr-5 text-right text-lg outline-none focus:ring-0 bg-white placeholder:text-black text-black"
                        value={inputNumber}
                        onChange={handleInputChange}
                      />
                      <span className="font-xs px-3 text-gray-400">
                        = € {inputNumber * knowledgePerInputCurrency}
                      </span>
                    </div>
                  </>
                )}
              </div>
              {selectedFunctionalOption !== functionalOptions[2].id && (
                <div className="mt-2 z-40 rounded-xl bg-white  absolute left-1/2 top-1/2">
                  <Image src={Swapicon} alt="swap-logo" priority />
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
                        value={outputNumber}
                        disabled={
                          selectedFunctionalOption === functionalOptions[1].id
                        }
                      />
                      <span className="font-xs px-3 text-gray-400">
                        = €
                        {(parseFloat(currencyValueInEuro) || 0) * outputNumber}
                      </span>
                    </div>
                  </>
                )}
                {selectedFunctionalOption === functionalOptions[0].id && (
                  <>
                    <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 hover:border-gray-900">
                      <span className="text-xs uppercase text-black">
                        KNOWLEDGE
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col text-right">
                      <input
                        type="number"
                        // placeholder="Knowledge Minting..."
                        className="w-full rounded-br-lg rounded-tr-lg border-0 pb-0.5 pr-5 text-right text-lg outline-none focus:ring-0 bg-white placeholder:text-black text-black"
                        value={outputNumber}
                        disabled={
                          selectedFunctionalOption === functionalOptions[0].id
                        }
                      />
                      <span className="font-xs px-3 text-gray-400">
                        = €{knowledgeValueInEuro?.toString()}
                      </span>
                    </div>
                  </>
                )}
                {selectedFunctionalOption === functionalOptions[2].id && (
                  <div className="flex gap-x-2">
                    <p className="text-green-500 text-xs">
                      <InfoOutlinedIcon className="mr-1" />
                      The price of KNOWLEDGE is less than its base price.
                      Burning your tokens now will yield you extra rewards.
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
                    ? `1 KNOWLEDGE ≈ ${knowledgePerInputCurrency} EURO`
                    : selectedFunctionalOption === functionalOptions[0].id
                    ? `1 EURO ≈ ${(1 / knowledgePerInputCurrency).toFixed(
                        4
                      )} KNOWLEDGE`
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
            {/* <div className="flex items-center text-black justify-between ">
                                <span className='font-medium text-sm'>Network Fee</span>
                                <span className='font-medium'>_ _</span>
                            </div>
                            <div className="flex items-center text-black justify-between ">
                                <span className='font-medium text-sm'>Criptic Fee</span>
                                <span className='font-medium'>_ _</span>
                            </div> */}
          </div>
          <button
            onClick={handleClick}
            className={`uppercase w-full text-sm rounded-lg mt-6 p-4 ${
              !hasEnoughTokens()
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-gray-800 text-white"
            }`}
            disabled={!hasEnoughTokens()}
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
