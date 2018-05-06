import Web3 from 'web3';

// Ripping out the MetaMask web3 injected version
// by handing over the preconfigured provider we want.
// Connecting to Rinkby.
const web3 = new Web3(window.web3.currentProvider);

export default web3;