const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

// (1) delete build folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// (2) get our Solidity file
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

// output has two contract objects.  Campaign contract, and CampaignFactory contact.
const output = solc.compile(source, 1).contracts;

// check to see if /build folder exists, if not create.
fs.ensureDirSync(buildPath);


console.log(output);

// (3) output both 

// Source and number of compile files.
// Can compile multiple files in one go.
// Exports object with compiled projects.
// On each contract, `bytecode` and `interface` (ABI)
// Now only returning `:Campaign`
// module.exports = solc.compile(source, 1).contracts[':Campaign'];

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        // contents we want to write to json file
        // `:Campaign` and `:CampaignFactory`
        output[contract]
    )
}