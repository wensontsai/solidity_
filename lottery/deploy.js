const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const secrets = require('./secrets');

// Specifies which account to unlock...
const provider = new HDWalletProvider(
    // With mnemonic, can gain access to account.
    // Using Infura provider.
        secrets.mnemonic,
        secrets.providerLink
    );

const web3 = new Web3(provider);

// Wrapping in function to use async/await.
// Immediately invoke after.
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    
    console.log('attemtping to deploy from account ', accounts[0]);
    
    // instantiate new eth contract, and pass JSON interface ABI
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ 
            data: bytecode 
        })
        .send({ 
            gas: '1000000', 
            from: accounts[0] 
        });

    console.log(interface);
    // peek contract.
    console.log('Contract deployed to ', result.options.address);
};
deploy();