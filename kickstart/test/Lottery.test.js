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
let lottery;

beforeEach(async () => {
    // Get a list of all 10 accounts for dev purposes.
    accounts = await web3.eth.getAccounts();

    // Use one of accounts to deploy contract.
    // using Contract constructor function - allows interaction
    // with existing contracts or creation of new contracts.
    // ABI => interface.
    // `deploy` creates transaction object.
    // `send` actually deploys to network. 
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({   
            data: bytecode    
        })
        .send({ 
            from: accounts[0],
            gas: '1000000'
        })

    lottery.setProvider(provider);
});

// (3) Manipulate contract
// (4) Assert contract change persisted and is correct.
describe('Lottery', () => {
    it('deploys a contract', () => {
        // console.log(lottery);
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 200
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('only manager can call pickWinner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1], // not manager account
            });
            assert(false); // fail test if we get to this line
        } catch (err) {
            assert(err); // err exists 
        }
    });

    // it('sends money to the winner and resets the players array', async () => {
    //     await lottery.methods.enter().send({
    //         from: accounts[0],
    //         value: web3.utils.toWei('2', 'ether')
    //     });
            
    //     // Balance before calling pickWinner
    //     const initialBalance = await web3.eth.getBalance(accounts[0]);
        
    //     // Pick winner
    //     await lottery.methods.pickWinner().send({
    //         from: accounts[0]
    //     });

    //     // Balance after.  money should be returned.
    //     const finalBalance = await web3.eth.getBalance(accounts[0]);
        
    //     // Assert with compensating for gas costs.
    //     const difference = finalBalance = initialBalance;
    //     assert(difference > web3.utils.toWei('1.8', 'ether'));
    // });
});