const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // constructor function here.

// (1) Deploy to local test network. 
// Generate local network for testing only.
// Ganache / Test RPC

// (2) Web3 to interact with deployed contract on network.
// Each instance can interact with another network.
// Pass Provider, the communication layer to talk to network.
const web3 = new Web3(ganache.provider());

