import fs from "fs";
import { WarpFactory } from "warp-contracts";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";
import { configureWallet, warp } from "./configureWarpServer.js";

async function deploy() {
  // const warp = WarpFactory.forTestnet().use(new DeployPlugin());
  // //   const wallet = await configureWallet();
  // const wallet = new ArweaveSigner(
  //   JSON.parse(fs.readFileSync("./wallet.json", "utf-8"))
  // );
  const state = fs.readFileSync("token-POWE.json", "utf-8");
  const contractsource = fs.readFileSync("Polyweave.js", "utf-8");

  const { contractTxId, srcTxId } = await warp.deploy({
    wallet: configureWallet,
    initState: state,
    src: contractsource,
  });
  fs.writeFileSync(
    "./transactionid.js",
    `export const transactionId = "${contractTxId}"`
  );

  const contract = warp.contract(contractTxId).connect(wallet);
  //   await contract.writeInteraction({
  //     function: "initialize",
  //   });
  const { cachedValue } = await contract.readState();

  console.log("Contract state: ", cachedValue);
  console.log("contractTxId: ", contractTxId);
  console.log("srcTxId: ", srcTxId);
}
deploy();
