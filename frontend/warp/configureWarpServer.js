import { WarpFactory } from "warp-contracts";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";
import fs from "fs";
import { ArweaveWebWallet } from "arweave-wallet-connector";

const webWallet = async () => {
  const webWallet = new ArweaveWebWallet();
  webWallet.setUrl("arweave.app");
  await webWallet.connect();
  return webWallet;
};

const warp = WarpFactory.forTestnet().use(new DeployPlugin());
const configureWallet = new ArweaveSigner(
  JSON.parse(fs.readFileSync("./wallet.json", "utf-8"))
);
const transactionId = "Z7CnF20BePqBfHYPZGPe_JdnHjr2JjRCWCX29C9NJIQ";

const contractWithAdmin = warp.contract(transactionId).connect(configureWallet);

export { webWallet, warp, configureWallet, transactionId, contractWithAdmin };
