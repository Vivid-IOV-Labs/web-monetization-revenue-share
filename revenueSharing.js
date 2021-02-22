const config = require(global.configFilePath)
var path = require('path');
const util = require('util')
const Web3 = require('web3');
// var web3 = new Web3(config.smartContract.provider);
const ABI = require(path.join(global.appRoot, config.smartContract.abiFilePath))

const RINKEBY_WSS = config.smartContract.provider
var provider = new Web3.providers.WebsocketProvider(RINKEBY_WSS);
var web3 = new Web3(provider);

provider.on('error', e => console.log('WS Error', e));
provider.on('end', e => {
    console.log('WS closed');
    console.log('Attempting to reconnect...');
    provider = new Web3.providers.WebsocketProvider(RINKEBY_WSS);

    provider.on('connect', function () {
        console.log('WSS Reconnected');
    });
    
    web3.setProvider(provider);
});


const _pointer = async (useReceiptVerification) => {
  var contract = new web3.eth.Contract(ABI, config.smartContract.address)
  
  try {
    var totalPercentage = await contract.methods.getTotalPercentage().call()
  } catch (error) {
    console.log('Total percentage error')
    console.log(error)
  }
  
  // Generate a number from 1 to totalPercentage
  var randomNum = Math.floor(1 + Math.random() * totalPercentage)

  try {
    var pointer = await contract.methods.pickPointer(randomNum).call()
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
