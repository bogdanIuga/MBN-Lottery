const { ethers } = require("hardhat");

async function main() {
    const accounts = [
        "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
        "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
        "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
        "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec"
    ];

    // for (let i = 0; i < accounts.length; i++) {
    //     const balance = await ethers.provider.getBalance(accounts[i]);
    //     console.log(`Account ${i}: ${accounts[i]} (balance=${ethers.utils.formatEther(balance)} ETH)`);
    // }

    const provider = ethers.getDefaultProvider();

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Send 0.01 ETH to each 
    for (let i = 0; i < accounts.length; i++) {
        const tx = await wallet.sendTransaction({
            to: accounts[i],
            value: ethers.utils.parseEther("0.01")
        });
        console.log(`Sent to: ${accounts[i]}`)
    }
}
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
