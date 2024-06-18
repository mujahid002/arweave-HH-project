import {
  configureWallet,
  transactionId,
  contractWithAdmin,
} from "./configureWarpServer.js";
import { writeContract } from "arweavekit";
import { readFileSync } from "fs";
import { webWallet } from "@/constants/powe.js";

async function read() {
  const { cachedValue } = await contractWithAdmin.readState();

  console.log("state: ", JSON.stringify(cachedValue));
}
// read();
export async function write(quantity) {
  const key = await webWallet();
  // const quantity = parseInt(100);
  const writeResult = await writeContract({
    environment: "testnet",
    contractTxId: transactionId,
    wallet: key,
    options: {
      function: "burn",
      qyt: quantity,
    },
  });

  console.log("transaction is", JSON.stringify(writeResult));
}
write();
// read();
