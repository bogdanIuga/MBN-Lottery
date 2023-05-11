const hre = require("hardhat");
const abi = require('../artifacts/contracts/Lottery.sol/Lottery.json').abi;

async function main() {
    // The address that we deployed to
    const deployedContractAddress = process.env.CONTRACT_ADDRESS;

    // Fetch the provider
    const [owner] = await ethers.getSigners();

    // Connect to the deployed contract
    const contract = new ethers.Contract(deployedContractAddress, abi, owner);

    // Call the endLottery function
    try {
        const tx = await contract.endLottery('Lottery1');
        const receipt = await tx.wait();
        console.log('Transaction receipt: ', receipt);
    } catch (error) {
        console.error('An error occurred: ', error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
