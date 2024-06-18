const { run } = require("hardhat");

const main = async () => {
  // Polyweave Token
  const polyweave = await hre.ethers.getContractFactory("Polyweave");
  console.log("Deploying Polyweave Contract...");
  const Polyweave = await polyweave.deploy();
  // {
  //   gasPrice: 50000000000,
  // },
  await Polyweave.waitForDeployment();
  const PolyweaveAddress = await Polyweave.getAddress();
  console.log("Polyweave Contract Address:", PolyweaveAddress);
  console.log("----------------------------------------------------------");

  // Verify Polyweave Contract
  console.log("Verifying Polyweave...");
  await run("verify:verify", {
    address: PolyweaveAddress,
    constructorArguments: [],
  });
  console.log("----------------------------------------------------------");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// CLI commands to deploy and verify Polyweave
// yarn hardhat run scripts/deploy.js --network optimismSepolia

// if not verified properly use this:
// yarn hardhat verify --network optimismSepolia DEPLOYED_CONTRACT_ADDRESS
