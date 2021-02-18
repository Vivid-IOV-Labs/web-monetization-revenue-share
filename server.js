// This is what Heroku instance will be executing.

var express = require('express');
var app = express();
var path = require('path');
const fetch = require("node-fetch");
var cors = require('cors')
const config = require('./config')
const pointers = require(config.paymentPointersPath)

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

const useSmartContract = (config.useSmartContract == 'true')
const useReceiptVerification = (config.useReceiptVerification == 'true')
const pickPointerSmartContract = require('./revenueSharing')

// Use smartContract or not to pick payment pointers.
if (useSmartContract) {
  console.log('Smart contract: Activated')
} else {
  console.log('Smart contract: Deactivated')
}

// Use receipt verification or not.
if (useReceiptVerification) {
  console.log('Receipt verification: Activated')
} else {
  console.log('Receipt verification: Deactivated')
}


app.post('/verifyReceipt', async (req, res) => {
  const resp = await fetch(config.receiptVerification.verifier, {
    method: 'POST',
    body: req.body.receipt
  })
  try {
    const { amount } = await resp.json()
    console.log('Received ' + amount)
    res.send({ message: 'ok', data: { received: amount } })
  } catch (error) {
    res.status(400).send(error)
  }
  // backend logic for new paid amount

})

// this is the same `pickPointer()` function implemented in the previous snippet
function pickPointer() {
  const sum = Object.values(pointers).reduce((sum, weight) => sum + weight, 0)
  let choice = Math.random() * sum

  for (var pointer in pointers) {
    const weight = pointers[pointer]
    if ((choice -= weight) <= 0) {
      if (useReceiptVerification) {
        pointer = config.receiptVerification.service + encodeURIComponent(pointer)
      }
      return pointer
    }
  }
}

// NOTE: If you want to have separetly the frontend and the backend (2 instances), you need to use app.get('/') instead of app.use()

app.get('/', async function (req, res, next) {
  // is this request meant for Web Monetization?

  if (req.header('accept').includes('application/spsp4+json')) {
    console.log('Revenue sharing active')

    // choose our random payment pointer
    if (useSmartContract) {
      var pointer = await pickPointerSmartContract(useReceiptVerification)
    } else {
      var pointer = pickPointer()
    }

    console.log('Payment pointer = ', pointer)

    // turn the payment pointer into a URL in accordance with the payment pointer spec
    // https://paymentpointers.org/
    const asUrl = new URL(pointer.startsWith('$') ? 'https://' + pointer.substring(1) : pointer)
    asUrl.pathname = asUrl.pathname === '/' ? '/.well-known/pay' : asUrl.pathname

    // redirect to our chosen payment pointer so they get paid
    res.redirect(302, asUrl.href)
  } else {
    console.log('Revenue sharing not active')
    // if the request is not for Web Monetization, do nothing
    next()
  }
})
