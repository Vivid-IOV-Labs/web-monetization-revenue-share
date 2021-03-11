var path = require('path');
global.appRoot = path.join(__dirname, '../../')
// global.appRoot = path.join(__dirname, '../wp-server-demo')

setUp = (configFilePath) => {
  const absoluteConfigFilePath = path.join(global.appRoot, configFilePath)
  global.config = require(absoluteConfigFilePath)

  if (global.config.useSmartContract == 'true') {
    console.log('Smart contract: Activated')
  } else {
    console.log('Smart contract: Deactivated')
  }
  if (global.config.useReceiptVerification == 'true') {
    console.log('Receipt verification: Activated')
  } else {
    console.log('Receipt verification: Deactivated')
  }
}

pickPointer = () => {
  const useReceiptVerification = (global.config.useReceiptVerification == 'true')
  const pointers = require(path.join(global.appRoot, global.config.paymentPointersPath))

  const sum = Object.values(pointers).reduce((sum, weight) => sum + weight, 0)
  let choice = Math.random() * sum

  for (var pointer in pointers) {
    const weight = pointers[pointer]
    if ((choice -= weight) <= 0) {
      if (useReceiptVerification) {
        pointer = global.config.receiptVerification.service + encodeURIComponent(pointer)
      }
      return pointer
    }
  }
}

getPointerUrl = async () => {
  const smartContract = require('./revenueSharing')
  const useSmartContract = (global.config.useSmartContract == 'true')

  // choose our random payment pointer
  if (useSmartContract) {
    var pointer = await smartContract.pickPointer()
  } else {
    var pointer = pickPointer()
  }
  
  const asUrl = new URL(pointer.startsWith('$') ? 'https://' + pointer.substring(1) : pointer)
  asUrl.pathname = asUrl.pathname === '/' ? '/.well-known/pay' : asUrl.pathname
  return asUrl.href
}

module.exports = { 
  setUp: setUp,
  getPointerUrl: getPointerUrl
}