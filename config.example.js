require('dotenv').config()

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
 