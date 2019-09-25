# pwinty-api

_A modern Node.js wrapper for the [Pwinty](http://pwinty.com) [API](https://pwinty.com/api/). Typescript definitions included_

## Installation

```bash
npm install pwinty-api
```

## Usage

Sign up to Pwinty and note the MerchantID and API key you received when signing up.

```js
import Pwinty, { ShippingMethod } from 'pwinty-api'

const pwinty = new Pwinty({
  merchantId: String, // defaults to process.env.PWINTY_MERCHANT_ID
  apiKey: String, // defaults to process.env.PWINTY_API_KEY
  baseApiEndpoint: String, // defaults to `https://api.pwinty.com/v3.0` if process.env.NODE_ENV === 'production', `https://sandbox.pwinty.com/v3.0` otherwise
})
```

Then access the Pwinty endpoints:

```js
pwinty.orders
  .create({
    recipientName: '',
    addressTownOrCity: 'Lyon',
    countryCode: 'FR',
    preferredShippingMethod: ShippingMethod.Standard,
  })
  .then(order => {
    // todo
  })
  .catch(err => {
    // todo
  })
```

See the [typescript definitions](./src/index.ts) for an overview of the methods available.

## License

MIT
