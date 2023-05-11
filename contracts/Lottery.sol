//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Lottery is Ownable {
    struct LotteryDetails {
        string name;
        uint startDate;
        bool ended;
        uint prizePool;
        address[] participants;
        mapping(address => bool) hasParticipated;
    }

    mapping(string => LotteryDetails) public lotteries;
    uint private commission;

    function startLottery(string memory name, uint startDate) public onlyOwner {
        require(lotteries[name].startDate == 0, "Lottery already exists");

        LotteryDetails storage newLottery = lotteries[name];
        newLottery.name = name;
        newLottery.startDate = startDate;
        newLottery.ended = false;
    }

    function participate(string memory name) public payable {
        require(lotteries[name].startDate != 0, "Lottery doesn't exist");
        require(lotteries[name].ended == false, "Lottery has ended");
        require(
            lotteries[name].hasParticipated[msg.sender] == false,
            "Address has already participated"
        );
        require(msg.value > 0, "Must send ETH to participate");

        lotteries[name].participants.push(msg.sender);
        lotteries[name].prizePool += msg.value;
        lotteries[name].hasParticipated[msg.sender] = true;
    }

    function random(string memory input) internal view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encodePacked(block.timestamp, block.difficulty, input)
                )
            );
    }

    function endLottery(string memory name) public onlyOwner {
        require(lotteries[name].startDate != 0, "Lottery doesn't exist");
        require(lotteries[name].ended == false, "Lottery has ended");
        require(
            lotteries[name].participants.length >= 2,
            "Not enough participants"
        );

        lotteries[name].ended = true;

        uint prizePool = lotteries[name].prizePool;
        commission += (prizePool * 5) / 100;

        uint random1 = random(string(abi.encodePacked(name, "1"))) %
            lotteries[name].participants.length;
        uint random2 = random(string(abi.encodePacked(name, "2"))) %
            lotteries[name].participants.length;

        // In the rare case where random1 equals random2, increment random2 by 1
        if (random1 == random2) {
            random2 = (random2 + 1) % lotteries[name].participants.length;
        }

        payable(lotteries[name].participants[random1]).transfer(
            (prizePool * 70) / 100
        );
        payable(lotteries[name].participants[random2]).transfer(
            (prizePool * 25) / 100
        );
    }

    function withdrawCommission() public onlyOwner {
        require(commission > 0, "No commission to withdraw");

        uint amount = commission;
        commission = 0;
        payable(owner()).transfer(amount);
    }
}
