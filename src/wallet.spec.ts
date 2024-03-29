import Wallet, { Processed, Action } from "./";
import { fetch } from "./utils";
global.fetch = fetch;

test("Wallet.init", () => {
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

});
