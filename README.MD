# Web Monetization Revenue Sharing

Use [web monetization](https://webmonetization.org) probabilistic revenue sharing in the backend together with a smart contract. <br>
Also able to include [receipt verification](https://webmonetization.org/docs/receipt-verifier).

# Install
    
    npm install web-monetization-revenue-share

# Setup

## Smart Contract ABI
  - Get the ABI of your smart contract
  - Store ABI in your project (eg: [smartContractABI.js](https://github.com/Vivid-IOV-Labs/web-monetization-revenue-share/blob/master/smartContractABI.example.js))

        const ABI = [
          // put your ABI here
        ]

        module.exports = ABI    

## Payment Pointers List
  - Create a list of payment pointers in case you don't want to use a smart contract (eg: [paymentPointers.js](https://github.com/Vivid-IOV-Labs/web-monetization-revenue-share/blob/master/paymentPointers.js))

        const pointers = {
          '$alice.example': 50,
          '$bob.example': 40,
          '$connie.example': 9.5,
          '$dave.example': 0.5
        }

        module.exports = pointers

## Config File
  - Create a config file to store all the parameters required (eg: [config.js](https://github.com/Vivid-IOV-Labs/web-monetization-revenue-share/blob/master/config.example.js))

        const config = {
          server: {
            port: process.env.PORT || 1337
          },
          useSmartContract: process.env.USE_SMART_CONTRACT || 'true',
          useReceiptVerification: process.env.USE_RECEIPT_VERIFICATION || 'false',
          paymentPointersPath: './paymentPointers',
          receiptVerification:{ 
            service: 'https://webmonetization.org/api/receipts/',
            verifier: 'https://webmonetization.org/api/receipts/verify'
          },
          smartContract: {
            provider: `wss://rinkeby.infura.io/ws/v3/${process.env.INFURA_KEY}`,
            address: '0x99deC650eb882c522ef49a5002Ff11fEdF5A146c',
            abiFilePath: './smartContractABI'
          }
        };
      
        module.exports = config;


# Use

    require('web-monetization-revenue-share')

