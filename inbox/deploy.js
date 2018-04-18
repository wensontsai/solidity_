const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const secrets = require('./secrets');

// Specifies which account to unlock...
const provider = new HDWalletProvider(
    // With mnemonic, can gain access to account.
        secrets.mnemonic,
        secrets.providerLink
    );

const web3 = new Web3(provider);