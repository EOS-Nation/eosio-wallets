# eosio-wallets

Frontend library to handle EOSIO wallets.

Allows to connect/disconnect to Anchor/ScatterJS wallets and push transactions.

Optionally makes possible backend transaction cosigning to pay for user resources.

### Install

```
yarn add eosio-wallets
```

### Configure

```ts
import Wallet from "eosio-wallets";

// basic usage
Wallet.init({
    blockchain: "eos",
    appId: "myapp",
});

// cosigner usage
Wallet.init({
    rpcEndpoint: "https://eos.api.eosnation.io",                     // EOSIO RPC endpoint
    chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",   // Chain ID
    appId: "myapp",                                         // App ID for wallets
    cosignEndpoint: "https://edge.pomelo.io/api/cosign",    // optional: cosign endpoint
    cosignReferrer: "myapp"                                 // optional: referrer for cosign noop action must adhere    to EOSIO name convention
});
```

### Usage

```ts
// connect to wallet ("anchor"/"scatter" protocols allowed)
const account = await Wallet.login(protocol);

// define action
const action = {
    account: 'eosio.token',
    name: 'transfer',
    authorization: [{ actor: 'sender', permission: 'active' }],
    data: { from: 'sender', to: 'receiver', quantity: '0.0001 EOS', memo: 'hello' }
};
// push the action
const cosign = true;
const { transaction_id, processed } = await Wallet.pushTransaction( [action], protocol, cosign );

// disconnect
await Wallet.logout();
```

### Example

- **Demo**: https://eosio-wallet.vercel.app/
- **Source code**: https://github.com/EOS-Nation/eosio-wallets-ui
