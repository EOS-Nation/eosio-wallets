# eosio-wallets
Frontend library to handle EOSIO wallets


### Install

```
yarn add eosio-wallets
```

### Configure
```
import { configWallet } from "eosio-wallets";

configWallet({
      rpcEndpoint: "https://eos.eosn.io",                     // EOSIO RPC endpoint
      chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",   // Chain ID
      appId: "myApp",                                         // App ID for wallets
      cosignEndpoint: "https://edge.pomelo.io/api/cosign",    // optional: cosign endpoint
      cosignReferrer: "myapp"                                 // optional: referrer for cosign noop action - must adhere to EOSIO name convention
    })
```

### Usage
```
import { loginWallet, logoutWallet, pushTransaction } from "eosio-wallets";

const account = await loginWallet(protocol);                    // connect to wallet with protocol "anchor"/"scatter"

const action = {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{ actor: 'fromaccount', permission: 'active' }],
        data: {
            'fromaccount',
            'toaccount',
            '0.0001 EOS',
            'memo`
        }
};
const trxId = await pushTransaction( [action], protocol, true ); // push transaction

await logoutWallet();                                           // disconnect wallet

```
