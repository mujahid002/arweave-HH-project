require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.23",
  networks: {
    // sepolia: {
    //   url: process.env.SEPOLIA_RPC_URL,
    //   accounts: [process.env.SEC_PRIVATE_KEY],
    //   chainId: 11155111,
    //   timeout: 10000,
    //   confirmations: 2,
    // },
    polygonAmoy: {
      url: process.env.AMOY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80002,
      timeout: 10000,
      confirmations: 2,
    },
    optimismSepolia: {
      url: process.env.OP_SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155420,
      // gasPrice: "auto",
      // gas: 5000000,
      timeout: 10000,
      confirmations: 2,
    },
  },
  etherscan: {
    // apiKey: {
    //   sepolia: process.env.SEPOLIA_API_KEY,
    // },
    // apiKey: {
    //   optimismSepolia: process.env.OP_SEPOLIA_API_KEY,
    // },
    // customChains: [
    //   {
    //     network: "optimismSepolia",
    //     chainId: 11155420,
    //     urls: {
    //       apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
    //       browserURL: "https://sepolia-optimistic.etherscan.io",
    //     },
    //   },
    // ],
    apiKey: {
      // polygonAmoy: process.env.AMOY_OKLINK_API_KEY,
      optimismSepolia: process.env.OP_SEPOLIA_API_KEY,
      polygonAmoy: process.env.AMOY_API_KEY,
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
      // {
      //   network: "polygonAmoy",
      //   chainId: 80002,
      //   urls: {
      //     apiURL:
      //       "https://www.oklink.com/api/explorer/v1/contract/verify/async/api/polygonAmoy",
      //     browserURL: "https://www.oklink.com/amoy",
      //   },
      // },
      {
        network: "optimismSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimistic.etherscan.io",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
};
