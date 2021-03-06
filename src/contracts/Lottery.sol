pragma solidity ^0.4.0;

contract Lottery {

    address public manager;
    address[] public players;

    constructor() public{
        manager = msg.sender;
    }

    function() public payable {
        require(msg.value > 0.1 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
    }

    function pickWinner() public restricted {

        uint index = random() % players.length;
        address winner = players[index];
        players = new address[](0);
        winner.transfer(this.balance);
    }

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address[]){
        return players;
    }
}
