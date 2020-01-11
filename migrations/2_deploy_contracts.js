/* global artifacts */
var VestingApp = artifacts.require('Vesting.sol')

module.exports = function(deployer) {
  deployer.deploy(VestingApp)
}
