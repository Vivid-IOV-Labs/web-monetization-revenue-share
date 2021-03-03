const { expect } = require('chai')

var path = require('path');

_setUp = (configFilePath) => {
  global.appRoot = path.join(__dirname, '../data')
  const absoluteConfigFilePath = path.join(global.appRoot, configFilePath)
  global.config = require(absoluteConfigFilePath)
}

configFilePath = './config.test.js'


describe('Server', async function () {

  describe('pickPointer with receipt verification', function () {
    it('should pick a payment pointer', async function () {

      const server = require('../../server')
      _setUp(configFilePath)
      global.config.useReceiptVerification = 'true'
      global.config.useSmartContract = 'false'

      const pointers = require(path.join(global.appRoot, global.config.paymentPointersPath))

      var pointerUrl = await server.getPointerUrl()

      const urlSplit = pointerUrl.split('/')
      const pointer = urlSplit[urlSplit.length - 1]

      var pointerReplaced = pointer.replace('%24', '$')

      var filtered = Object.keys(pointers)
        .filter(key => pointerReplaced.includes(key))
        .reduce((obj, key) => {
          obj[key] = pointers[key];
          return obj;
        }, {});

      expect(filtered).to.not.eql({})
    })
  });

  describe('pickPointer without receipt verification', function () {
    it('should pick a payment pointer', async function () {
      const server = require('../../server')
      _setUp(configFilePath)
      global.config.useReceiptVerification = 'false'
      global.config.useSmartContract = 'false'

      const pointers = require(path.join(global.appRoot, global.config.paymentPointersPath))
      
      var pointerUrl = await server.getPointerUrl()

      const urlSplit = pointerUrl.split('/')
      var pointer = urlSplit[2]
      pointer = '$' + pointer

      var filtered = Object.keys(pointers)
        .filter(key => pointer.includes(key))
        .reduce((obj, key) => {
          obj[key] = pointers[key];
          return obj;
        }, {});

      expect(filtered).to.not.eql({})
    });
  });

})