const config = require(global.configFilePath)
var path = require('path');
// const util = require('util')
// const Web3 = require('web3');
// var web3 = new Web3(config.smartContract.provider);
const ABI = require(path.join(global.appRoot, config.smartContract.abiFilePath))

// const RINKEBY_WSS = config.smartContract.provider

const { ethers } = require('ethers')
const itx = new ethers.providers.InfuraProvider(
  'rinkeby',
  // TODO: Add this in the .config file.
  process.env.INFURA_KEY
)

const revShareContract = new ethers.Contract(config.smartContract.address, ABI, itx);

const _pointer = async (useReceiptVerification) => {
  // var contract = new web3.eth.Contract(ABI, config.smartContract.address)

  try {
    // var totalPercentage = await contract.methods.getTotalPercentage().call()
    var totalPercentage = await revShareContract.getTotalPercentage()
    var bigInt = totalPercentage._hex
    var totalPercentage = ethers.BigNumber.from(bigInt).toNumber()
  
  } catch (error) {
    console.log('Total percentage error')
    console.log(error)
  }

  // Generate a number from 1 to totalPercentage
  var randomNum = Math.floor(1 + Math.random() * totalPercentage)

  try {
    // var pointer = await contract.methods.pickPointer(randomNum).call()
    var pointer = await revShareContract.pickPointer(randomNum)
  } catch (error) {
    console.log('Pick pointer error')
    console.log(error)
  }

  if (useReceiptVerification) {
    pointer = config.receiptVerification.service + encodeURIComponent(pointer)
  }

  console.log(pointer)
  return pointer
}

module.exports = (useReceiptVerification) => {
  return _pointer(useReceiptVerification)
};
