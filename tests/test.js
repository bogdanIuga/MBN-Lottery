const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery Contract", function () {
    it("Should execute the lottery flow", async function () {
        const Lottery = await ethers.getContractFactory("Lottery");
        const lottery = await Lottery.deploy();
        await lottery.deployed();
        console.log(`Lottery contract deployed to: ${lottery.address}`);

        await lottery.startLottery("Test Lottery", Date.now());
        console.log(`New lottery: Test Lottery started successfully!`);

        const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
        console.log(JSON.stringify(addr1));
        console.log(JSON.stringify(addr2));
        console.log(JSON.stringify(addr3));
        console.log(JSON.stringify(addr4));
        console.log(JSON.stringify(addr5));

        await lottery.connect(addr1).participate("Test Lottery", { value: ethers.utils.parseEther("0.00001") });
        await lottery.connect(addr2).participate("Test Lottery", { value: ethers.utils.parseEther("0.00001") });
        await lottery.connect(addr3).participate("Test Lottery", { value: ethers.utils.parseEther("0.00001") });
        await lottery.connect(addr4).participate("Test Lottery", { value: ethers.utils.parseEther("0.00001") });
        await lottery.connect(addr5).participate("Test Lottery", { value: ethers.utils.parseEther("0.00001") });

        await lottery.endLottery("Test Lottery");
        console.log("ENDED!");
    });
});
