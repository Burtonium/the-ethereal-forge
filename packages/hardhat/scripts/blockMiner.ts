import { ethers } from "hardhat";

async function main() {
  while (true) {
    await ethers.provider.send("evm_mine", []);
    console.log("New block mined!");
    await new Promise(res => setTimeout(res, 3000));
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
