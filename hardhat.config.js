require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {},
    ropsten: {
      url : "https://bnb-testnet.api.onfinality.io/public",
      accounts: ["ccc18a00142e6afd5223de5c6ad8be241ca2c7492125465ca57bf2711ca89edb"]
    }
  }
};
