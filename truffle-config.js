const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    ropsten: {
      provider: () => new HDWalletProvider('coral thunder claim crisp rack goat roast crane monster turtle verify group', `https://ropsten.infura.io/v3/4e5baf52beec44dd906ec5245fbe25dc`),
      network_id: 3,       // Ropsten's id
      gas: 3000000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true,   // Skip dry run before migrations? (default: false for public nets )
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200
    },
  },
  compilers: {
    solc: {
       version: "0.8.7",    // Fetch exact version from solc-bin (default: truffle's version)

          }
  }
};

