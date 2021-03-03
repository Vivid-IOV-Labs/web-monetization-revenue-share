const { expect } = require('chai')

var path = require('path');

_setUp = (configFilePath) => {
  global.appRoot = path.join(__dirname, '../data')
  const absoluteConfigFilePath = path.join(global.appRoot, configFilePath)
  global.config = require(absoluteConfigFilePath)
}

configFilePath = './config.test.js'
_setUp(configFilePath)


describe('Smart Contract', async function () {

  describe('pickPointer with receipt verification', function () {
    it('should pick a payment pointer', async function () {
      global.config.useReceiptVerification = 'true'
      const smartContract = require('../../revenueSharing')

      var pointer = await smartContract.pickPointer()
      const urlSplit = pointer.split('/')
      const paymentPointer = urlSplit[urlSplit.length - 1]
      
      // console.log('paymentPointer = ', paymentPointer)

      expect(paymentPointer.includes('%')).to.eql(true)
    })
  });

  describe('pickPointer without receipt verification', function () {
    it('should pick a payment pointer', async function () {
      global.config.useReceiptVerification = 'false'
      const smartContract = require('../../revenueSharing')

      var pointer = await smartContract.pickPointer()
      const urlSplit = pointer.split('/')
      const paymentPointer = urlSplit[urlSplit.length - 1]

      expect(paymentPointer.includes('%')).to.eql(false)
    })
  });

});
