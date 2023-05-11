const hre = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;

    const Lottery = await hre.ethers.getContractFactory("Lottery");
    const lottery = Lottery.attach(contractAddress);

    // Get signers
    const [owner, addr1] = await ethers.getSigners();

    // Start a new lottery
    const lotteryName = "Lottery1";
    await lottery.startLottery(lotteryName, Date.now());

    console.log(`New lottery: ${lotteryName} started successfully!`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
