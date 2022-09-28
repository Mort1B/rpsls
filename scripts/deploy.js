// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
    const [owner, randomPerson] = await hre.ethers.getSigners();

  const RPSFactory = await hre.ethers.getContractFactory("RPS");
  const HasherFactory = await hre.ethers.getContractFactory("Hasher");

  // J1 hash
  const HasherContract = await HasherFactory.deploy();
  console.log("HASHER CONTRACT ADDRESS ----", HasherContract.address);

  const hash = await HasherContract.hash(1, 1);
  const RPSContract = await RPSFactory.deploy(hash, randomPerson.address, {
    value: 1,
  });
  console.log("RPS CONTRACT ADDRESS ----", RPSContract.address);
  console.log("RPS STAKE----", await RPSContract.stake());

  // Now p2 plays and pays
  // const player2Hash = solidityKeccak256(["uint8", "uint256"], [2, 1]);
  await RPSContract.connect(randomPerson).play(2, {
    value: 1,
  });

  const timeouts = RPSContract.TIMEOUT();
  console.log("If someone takes longer than %s", await timeouts);

  await RPSContract.solve(1, 1);

  console.log("FINAL BALANCE 1", await owner.getBalance());
  console.log("FINAL BALANCE 2", await randomPerson.getBalance());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
