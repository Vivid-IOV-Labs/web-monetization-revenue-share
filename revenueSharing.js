var path = require('path');
const { ABI, address } = require(path.join(global.appRoot, global.config.smartContract.smartContractInfoFilePath))
const { ethers } = require('ethers')

const itx = new ethers.providers.InfuraProvider(
  global.config.smartContract.provider,
  global.config.smartContract.key,
)
const revShareContract = new ethers.Contract(address, ABI, itx);

const _pickPointer = async () => {
  try {
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
    var pointer = await revShareContract.pickPointer(randomNum)
  } catch (error) {
    console.log('Pick pointer error')
    console.log(error)
  }

  if (global.config.useReceiptVerification == 'true') {
    pointer = global.config.receiptVerification.service + encodeURIComponent(pointer)
  }

  return pointer
}

module.exports = {
  pickPointer: _pickPointer
};
