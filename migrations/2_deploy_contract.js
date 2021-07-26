const Predictor = artifacts.require("Predictor");

module.exports = function(deployer) {
  deployer.deploy(Predictor);
};