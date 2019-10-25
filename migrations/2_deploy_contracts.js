/* global artifacts */
var ClaimApp = artifacts.require('ClaimApp.sol')

module.exports = function(deployer) {
  deployer.deploy(ClaimApp)
}
