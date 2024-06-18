import { WarpFactory } from "warp-contracts";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";
// import { readFileSync } from "fs";
// For passing to wallet param using the arweave.app wallet
import { ArweaveWebWallet } from "arweave-wallet-connector";
// import { configureWallet } from "../../warp/configureWarpServer";

const webWallet = async () => {
  const webWallet = new ArweaveWebWallet();
  webWallet.setUrl("arweave.app");
  await webWallet.connect();
  return webWallet;
};

const warp = WarpFactory.forTestnet().use(new DeployPlugin());
//   const wallet = await configureWallet();
// const configureWallet = new ArweaveSigner(
//   JSON.parse(readFileSync("./wallet.json", "utf-8"))
// );
const transactionId = "Z7CnF20BePqBfHYPZGPe_JdnHjr2JjRCWCX29C9NJIQ";

// const contractWithAdmin = warp.contract(transactionId).connect(configureWallet);

export { webWallet, warp, transactionId };

// export async function mint(target, quantity) {
//   const key = JSON.parse(fs.readFileSync("./wallet.json").toString());
//   const writeResult = await writeContract({
//     environment: "testnet",
//     contractTxId: transactionId,
//     wallet: key,
//     options: {
//       function: "mint",
//       target: target,
//       qyt: quantity,
//     },
//   });

//   console.log("transaction is", JSON.stringify(writeResult));
//   return writeResult;
// }
