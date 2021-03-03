require('dotenv').config()

const config = {
  server: {
    port: process.env.PORT || 1337
  },
  useSmartContract: process.env.USE_SMART_CONTRACT || 'true',
  useReceiptVerification: process.env.USE_RECEIPT_VERIFICATION || 'false',
  paymentPointersPath: './paymentPointers.test.js',
  receiptVerification:{ 
    service: 'https://webmonetization.org/api/receipts/',
    verifier: 'https://webmonetization.org/api/receipts/verify'
  },
  smartContract: {
    provider: 'rinkeby',  // use the network of your choice
    key: process.env.INFURA_KEY,  // eg: If using Infura to access rinkeby use your Infura Project Key here 
    smartContractInfoFilePath: './smartContractInfo.test.json'
  }
 };
 
 module.exports = config;
 