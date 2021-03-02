# Web Monetization Revenue Sharing

Use [web monetization](https://webmonetization.org) probabilistic revenue sharing in the backend together with a smart contract. <br>
Also able to include [receipt verification](https://webmonetization.org/docs/receipt-verifier).<br>
This module uses as default smart contract connection settings for Infura.

# Install
    
    npm install web-monetization-revenue-share

# Setup

## Smart Contract ABI
  - Get the ABI of your smart contract
  - Store ABI in your project (eg: [smartContractInfo.json](https://github.com/Vivid-IOV-Labs/web-monetization-revenue-share/blob/master/smartContractInfo.example.json))


        {
          "address": "yourSmartContractAddress",
          "ABI": [
            // your smart contract ABI
          ]
        }

## Payment Pointers List
  - Create a list of payment pointers in case you don't want to use a smart contract (eg: [paymentPointers.js](https://github.com/Vivid-IOV-Labs/web-monetization-revenue-share/blob/master/paymentPointers.example.js))

        const pointers = {
          '$alice.example': 50,
          '$bob.example': 40,
          '$connie.example': 9,
          '$dave.example': 1
        }

        module.exports = pointers

## Config File
  - Create a config file to store all the parameters required (eg: [config.js](https://github.com/Vivid-IOV-Labs/web-monetization-revenue-share/blob/master/config.example.js))

        const config = {
          server: {
            port: 1337
          },
          useSmartContract: 'true',
          useReceiptVerification: 'false',
          paymentPointersPath: './paymentPointers',
          receiptVerification:{ 
            service: 'https://webmonetization.org/api/receipts/',
            verifier: 'https://webmonetization.org/api/receipts/verify'
          },
          smartContract: {
            provider: 'rinkeby', // use the network of your choice
            key: yourKeyForRinkeby, // eg: If using Infura to access rinkeby use your Infura Project Key here 
            smartContractInfoFilePath: './smartContractInfo.json'
          }
        };
      
        module.exports = config;


# Use

    const wmRevenueShare = require('web-monetization-revenue-share')
    wmRevenueShare.setUp('/config')
    const paymentPointerUrl = await wmRevenueShare.getPointerUrl()


## Express Example 
### How to include it into your expressJS server.
##### server.js (on the backend)


    var express = require('express');
    var app = express();
    const fetch = require("node-fetch");
    var cors = require('cors')
    const config = require('./config')
    const wmRevenueShare = require('web-monetization-revenue-share')

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())

    const PORT = config.server.port;
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });

    wmRevenueShare.setUp('./config')

    // Your endpoint that you will reach from the frontend.
    app.post('/verifyReceipt', async (req, res) => {
      const resp = await fetch(config.receiptVerification.verifier, {
        method: 'POST',
        body: req.body.receipt
      })

      const { amount } = await resp.json()
      console.log('Received ' + amount)

      // backend logic for new paid amount

      res.send({ message: 'ok', data: { received: amount } })
    })

    app.get('/', async function (req, res, next) {
      // is this request meant for Web Monetization?
      
      if (req.header('accept').includes('application/spsp4+json')) {
        console.log('Revenue sharing active')
        const paymentPointerUrl = await wmRevenueShare.getPointerUrl()
        console.log(`Payment pointer: ${paymentPointerUrl}`)

        // redirect to our chosen payment pointer so they get paid
        res.redirect(302, paymentPointerUrl)
      } else {
        // if the request is not for Web Monetization, do nothing
        console.log('Revenue sharing not active')
        next()
      }
    })

<br>

##### index.ejs (on the frontend) 
_The frontend could be on a different server, for example in a different Heroku instance_


    <head>
      <meta name="monetization" content="https://your-server-running-server.js-file/">  
      
      <!-- Use this script for receipt verification -->
      <script>

        if (document.monetization) {
          document.monetization.addEventListener('monetizationprogress', async event => {
            // A payment has been received.
            console.log('A payment has been received.')
            console.log(event.detail.receipt)

            // Connect to your site’s backend to validate the payment. This does NOT connect directly to the receipt verifier.
            const res = await fetch('https://revsharetest.peerkat.live/verifyReceipt', {
              method: 'POST',
              headers: {
                'content-type': 'application/json'
              },
              body: JSON.stringify({
                receipt: event.detail.receipt
              })
            })
          })
        }
      </script>
    </head>


You may find a full working example [here](https://github.com/Vivid-IOV-Labs/gftw-server-demo).