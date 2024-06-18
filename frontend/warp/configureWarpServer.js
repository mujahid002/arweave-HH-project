import { WarpFactory } from "warp-contracts";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";
import fs from "fs";
// For passing to wallet param using the arweave.app wallet
import { ArweaveWebWallet } from "arweave-wallet-connector";

const webWallet = async () => {
  const webWallet = new ArweaveWebWallet();
  webWallet.setUrl("arweave.app");
  await webWallet.connect();
  return webWallet;
};

const warp = WarpFactory.forTestnet().use(new DeployPlugin());
//   const wallet = await configureWallet();
const configureWallet = new ArweaveSigner(
  JSON.parse(fs.readFileSync("./wallet.json", "utf-8"))
);
const transactionId = "Z7CnF20BePqBfHYPZGPe_JdnHjr2JjRCWCX29C9NJIQ";

const contractWithAdmin = warp.contract(transactionId).connect(configureWallet);

export { webWallet, warp, configureWallet, transactionId, contractWithAdmin };

// import { WarpFactory } from "warp-contracts";
// import { DeployPlugin } from "warp-contracts-plugin-deploy";
// import fs from "fs";

// // environment can be 'local' | 'testnet' | 'mainnet' | 'custom';

// const environment = process.env.WARPENV || "testnet";
// let warp;

// if (environment === "testnet") {
//   warp = WarpFactory.forTestnet().use(new DeployPlugin());
// } else if (environment === "mainnet") {
//   warp = WarpFactory.forMainnet().use(new DeployPlugin());
// } else {
//   throw Error("environment not set properly...");
// }

// async function configureWallet() {
//   try {
//     if (environment === "testnet") {
//       try {
//         return JSON.parse(fs.readFileSync("./testwallet.json", "utf-8"));
//       } catch (err) {
//         const { jwk } = await warp.generateWallet();
//         fs.writeFileSync("./testwallet.json", JSON.stringify(jwk));
//         return jwk;
//       }
//     } else if (environment === "mainnet") {
//       return JSON.parse(fs.readFileSync("../wallet.json", "utf-8"));
//     } else {
//       throw Error("Wallet not configured properly...");
//     }
//   } catch (err) {
//     throw Error("Wallet not configured properly...", err);
//   }
// }

// export { configureWallet, warp };
