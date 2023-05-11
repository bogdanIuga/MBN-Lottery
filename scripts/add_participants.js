const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;  // replace with your contract address

    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = Lottery.attach(contractAddress);

    // Get available accounts
    const accounts = await hre.ethers.provider.listAccounts();
    console.log(JSON.stringify(accounts));
    if (accounts.length < 2) {
        console.log(`Error: There are not enough accounts available to participate in the lottery.`);
        return;
    }

    // Get signers
    const signers = await ethers.getSigners();

    // Participate in the lottery from multiple accounts
    for (let i = 0; i < 5; i++) {
        const hasParticipated = await lottery.participants[signers[i].address];
        if (hasParticipated) {
            console.log(`Account ${signers[i].address} has already participated in the lottery.`);
            continue;
        }

        //check for user's balance
        const balance = await signers[i].getBalance();
        if (balance.lt(ethers.utils.parseEther("0.0001"))) {
            console.log(`Account ${signers[i].address} doesn't have enough Ether to participate.`);
            continue;
        }

        try {
            await lottery.connect(signers[i]).participate("Lottery1", { value: ethers.utils.parseEther("0.0001") });
            console.log(`Participation successful for account ${signers[i].address}!`);
        } catch (error) {
            console.error(`Participation failed for account ${signers[i].address}:`, error);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
