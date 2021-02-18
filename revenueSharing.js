const config = require(global.configFilePath)
var path = require('path');
const util = require('util')
const Web3 = require('web3');
var web3 = new Web3(config.smartContract.provider);
const ABI = require(path.join(global.appRoot, config.smartContract.abiFilePath))


const _pointer = async (useReceiptVerification) => {
  var contract = new web3.eth.Contract(ABI, config.smartContract.address)
  
  var totalPercentage = await contract.methods.getTotalPercentage().call()
  // Generate a number from 1 to totalPercentage
  var randomNum = Math.floor(1 + Math.random() * totalPercentage)
  var pointer = await contract.methods.pickPointer(randomNum).call()

  if (useReceiptVerification) {
    pointer = config.receiptVerification.service + encodeURIComponent(pointer)
  }

  return pointer
}

module.exports = (useReceiptVerification) => {
  return _pointer(useReceiptVerification)
};
