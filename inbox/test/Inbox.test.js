const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // constructor function here.
const web3 = new Web3(ganache.provider()); // instance

// (1) Deploy contract to local test network. 
// Generate local network for testing only.
// Ganache / Test RPC
// Accounts are unlocked for convenience.
// Grab one for use in network.

// (2) Web3 to interact with deployed contract on network.
// Each instance can interact with another network.
// Pass Provider, the communication layer to talk to network.
beforeEach(() => {
    // Get a list of all 10 accounts for dev purposes.
    web3.eth.getAccounts()
        .then(fetchedAccounts => {
            console.log(fetchedAccounts);
        });

    // Use one of accounts to deploy contract.
    
});

// (3) Manipulate contract
// (4) Assert contract change persisted and is correct.
describe('Inbox', () => {
    it('deploys a contract', () => {

    }); 
});