# Description

ETH faucet contract and frontend. Build with react, web3js, and biconomy.

Visit at [https://ethily.io/rinkeby-faucet](https://ethily.io/rinkeby-faucet)

## installation notes

1. Compile and deploy *contracts/Faucet.sol* and send some ETH to it's address.

2. Add the contract to your biconomy dashboard. (You need the address of the Faucet contract and it's abi.) Afterwards you need to add an API for for the *Execute_Metatransaction*-function of the contract to your biconomy dapp.

3. Last: config the frontend, build and publish it.

## config

### .env vars
```
REACT_APP_INFURA='<INFURA API KEY>'
REACT_APP_NETWORK=4 
REACT_APP_RPC='<RPC URL>'
REACT_APP_BLOCKEXPLORER_URL='https://rinkeby.etherscan.io'
REACT_APP_BLOCKEXPLORER_NAME='etherscan'
REACT_APP_BICONOMY_KEY='<BICONOMY API KEY>'
REACT_APP_CONTRACT='<CONTRACT ADDRESS>'
```

### OR in App.js:8-18

```
  const wrapperConfig = {
    infura: '<INFURA API KEY>',
    network: 4,
    rpc: '<RPC URL>'
    blockexplorer: { 
      url: 'https://rinkeby.etherscan.io',
      name: 'etherscan'
    },
    biconomy: 'true',
    biconomy_key: '<BICONOMY API KEY>',
    contract: '<CONTRACT ADDRESS>'
  }
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

