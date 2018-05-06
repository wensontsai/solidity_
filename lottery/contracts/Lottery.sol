pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players; 
    
    // CONSTRUCTOR:
    function Lottery() public {
        // `msg` global variable has
        // account and call/transaction data
        // to network.
        // msg: {data:, gas:, sender:, value: }
        // msg.value is ether amt.
        // msg obj available every time we interact
        // with contract.
        // global for entire contract.
        
        // Assign whoever runs Lottery
        // and assign address as manager
        manager = msg.sender;
    }
    
    // MODIFIERS:
    modifier restrictToManagerOnly() {
        // _ is yield, include,
        // decorator-like capability.
        require(msg.sender == manager);
        _;
    }
    
    // PUBLIC:
    function getPlayers() public view returns(address[]) {
        return players;
    }
    
    function enter() public payable {
        // If this evals to False, then returns.
        // working in Wei currently.
        require(msg.value > 0.01 ether);
        
        players.push(msg.sender);
    }
    
    function pickWinner() public restrictToManagerOnly{
        // Gate so only manager can run.
        // now in restrictToManagerOnly modifier.
        // require(msg.sender == manager);
        
        // Not really random, hack-ish.
        uint index = random() % players.length;
        
        // Returns hash, because players stores addresses.
        // .transfer is Global variable.
        // this.balance is given for class.
        players[index].transfer(this.balance);

        // address of winner.
        lastWinner = players[index];
        
        // Clear out players array for next lottery.
        // Construct with size 0.
        players = new address[](0);
    }
    
    // PRIVATE:
    function random() private view returns (uint) {
        // block object is Global variable.
        // now is Global variable.
        return uint(sha3(block.difficulty, now, players));
    }
    
}