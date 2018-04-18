const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // constructor function here.

const provider = ganache.provider();
const web3 = new Web3(provider); // instance
const { interface, bytecode } = require('../compile');
    

// (1) Deploy contract to local Ganache test network. 
// Generate local network for testing only.
// Ganache / Test RPC
// Accounts are unlocked for convenience.
// Grab one for use in network.

// (2) Web3 to interact with deployed contract on network.
// Each instance can interact with another network.
// Pass Provider, the communication layer to talk to network.
let accounts;
let inbox;
let INITIAL_STRING = 'Hi, there!';

beforeEach(async () => {
    // Get a list of all 10 accounts for dev purposes.
    accounts = await web3.eth.getAccounts();

    // Use one of accounts to deploy contract.
    // using Contract constructor function - allows interaction
    // with existing contracts or creation of new contracts.
    // ABI => interface.
    // `deploy` creates transaction object.
    // `send` actually deploys to network. 
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({   
            data: bytecode,
            arguments: [INITIAL_STRING]    
        })
        .send({ 
            from: accounts[0],
            gas: '1000000'
        })

    inbox.setProvider(provider);
});

// (3) Manipulate contract
// (4) Assert contract change persisted and is correct.
describe('Inbox', () => {
    it('deploys a contract', () => {
        console.log(inbox);
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        // `setMessage` & `message` (getter)
        // come through on `methods`
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    it('can change the message', async () => {
        // Change message.
        const newMessage = 'sockajaweeeya';
        // When we send someone MUST PAY!  (accounts)
        // Thanks for the free GAS Ganache!! ʕ •ᴥ•ʔ
        // gives back transaction hash, a receipt...
        // Error will bubble, if transaction isn't returned based on
        // async/await .send()
        await inbox.methods.setMessage(newMessage).send({ from: accounts[0] });
    
        // What's it after setting?
        const message = await inbox.methods.message().call();
        assert.equal(message, newMessage);
    });
});