import * as Wallet from "./wallet";

test("Wallet.init", () => {
    Wallet.init({
        rpcEndpoint: "https://eos.api.eosnation.io",                     // EOSIO RPC endpoint
        chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",   // Chain ID
        appId: "myapp",                                         // App ID for wallets
        cosignEndpoint: "https://edge.pomelo.io/api/cosign",    // optional: cosign endpoint
        cosignReferrer: "myapp"                                 // optional: referrer for cosign noop action must adhere    to EOSIO name convention
    });
});
