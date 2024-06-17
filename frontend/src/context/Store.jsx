import { createContext, useContext, useState } from "react";

// Create the context
const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState("");
  const [arUserAddress, setArUserAddress] = useState("");
  const [nativeBalance, setNativeBalance] = useState("");
  const [pstBalance, setPstBalance] = useState("");
  const [maticPrice, setMaticPrice] = useState(0);
  const [maticDeposits, setMaticDeposits] = useState(0);
  const [pstDeposits, setPstDeposits] = useState(0);

  return (
    <GlobalContext.Provider
      value={{
        userAddress,
        setUserAddress,
        arUserAddress,
        setArUserAddress,
        nativeBalance,
        setNativeBalance,
        pstBalance,
        setPstBalance,
        maticPrice,
        setMaticPrice,
        maticDeposits,
        setMaticDeposits,
        pstDeposits,
        setPstDeposits,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
