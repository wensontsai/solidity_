const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// Source and number of compile files.
// Can compile multiple files in one go.
// Exports object with compiled projects.
// On each contract, `bytecode` and `interface` (ABI)
// Now only returning `:Inbox`
module.exports = solc.compile(source, 1).contracts[':Inbox'];