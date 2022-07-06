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
    authorization: [{ actor: 'fromaccount', permission: 'active' }],
    data: { 'fromaccount', 'toaccount', '0.0001 EOS', 'memo' }
};
// push the action
const trxId = await Wallet.pushTransaction( [action], protocol, true );

// disconnect
await Wallet.logout();
```

### Example

- **Demo**: https://eosio-wallet.vercel.app/
- **Source code**: https://github.com/EOS-Nation/eosio-wallets-ui
