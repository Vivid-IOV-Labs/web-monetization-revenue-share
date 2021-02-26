// This is what Heroku instance will be executing.

var express = require('express');
var app = express();
var path = require('path');
const fetch = require("node-fetch");
var cors = require('cors')
global.appRoot = path.join(__dirname, '../../')
// global.appRoot = path.join(__dirname, '../gftw-server-demo')

setUp = (configFilePath) => {
  global.configFilePath = path.join(global.appRoot, configFilePath)
  global.config = require(global.configFilePath)
  // const config = require(global.configFilePath)
  // const pointers = require(path.join(global.appRoot, config.paymentPointersPath))

  // const useSmartContract = (global.config.useSmartContract == 'true')
  // const useReceiptVerification = (global.config.useReceiptVerification == 'true')
  // const smartContract = require('./revenueSharing')

  // Use smartContract or not to pick payment pointers.
  if (global.config.useSmartContract == 'true') {
    console.log('Smart contract: Activated')
  } else {
    console.log('Smart contract: Deactivated')
  }

  // Use receipt verification or not.
  if (global.config.useReceiptVerification == 'true') {
    console.log('Receipt verification: Activated')
  } else {
    console.log('Receipt verification: Deactivated')
  }


  // app.post('/verifyReceipt', async (req, res) => {
  //   const resp = await fetch(config.receiptVerification.verifier, {
  //     method: 'POST',
  //     body: req.body.receipt
  //   })
  //   try {
  //     const { amount } = await resp.json()
  //     console.log('Received ' + amount)
  //     res.send({ message: 'ok', data: { received: amount } })
  //   } catch (error) {
  //     res.status(400).send(error)
  //   }
  //   // backend logic for new paid amount

  // })

}

// this is the same `pickPointer()` function implemented in the previous snippet
function pickPointer() {
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

pointerUrl = async () => {
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

  // NOTE: If you want to have separetly the frontend and the backend (2 instances), you need to use app.get('/') instead of app.use()

  // app.get('/', async function (req, res, next) {
  //   // is this request meant for Web Monetization?
    
  //   if (!req.header('accept')) {
  //     console.log('Request header undefined')
  //     console.log(req)
  //   }

  //   console.log('Req headers: ')
  //   console.log(JSON.stringify(req.headers));
  
  //   if (req.header('accept').includes('application/spsp4+json')) {
  //     console.log('Revenue sharing active')

  //     // choose our random payment pointer
  //     if (useSmartContract) {
  //       var pointer = await smartContract.pickPointer()
  //     } else {
  //       var pointer = pickPointer()
  //     }

  //     console.log('Payment pointer = ', pointer)

  //     // turn the payment pointer into a URL in accordance with the payment pointer spec
  //     // https://paymentpointers.org/
  //     const asUrl = new URL(pointer.startsWith('$') ? 'https://' + pointer.substring(1) : pointer)
  //     asUrl.pathname = asUrl.pathname === '/' ? '/.well-known/pay' : asUrl.pathname

  //     // redirect to our chosen payment pointer so they get paid
  //     res.redirect(302, asUrl.href)
  //   } else {
  //     console.log('Revenue sharing not active')
  //     // if the request is not for Web Monetization, do nothing
  //     next()
  //   }
  // })
  
// }


// module.exports.start = (configFilePath) => { 
//   start(configFilePath)
// }

module.exports = { 
  setUp: setUp,
  pointerUrl: pointerUrl
}