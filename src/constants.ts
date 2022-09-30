export type Chain = "eos" | "wax" | "telos";

export const IDENTIFIER = "myapp"
export const ANCHOR_FUEL_REFERRER = IDENTIFIER;
export const ANCHOR_IDENTIFIER = IDENTIFIER;
export const SCATTER_IDENTIFIER = IDENTIFIER;

export const EOSIO_RPCS = new Map([
    ['eos', 'https://eos.greymass.com'],
    ['wax', 'https://wax.greymass.com'],
    ['telos', 'https://telos.greymass.com'],
]);

export const EOSIO_CHAIN_IDS = new Map([
    ['eos', 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'],
    ['wax', '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4'],
    ['telos', '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'],
]);

export const REVERSE_EOSIO_CHAIN_IDS = new Map(Array.from(EOSIO_CHAIN_IDS.entries()).map(([a, b]) => [b, a]));

export const EOSIO_RPC = EOSIO_RPCS.get("eos");
export const EOSIO_CHAIN_ID = EOSIO_CHAIN_IDS.get("eos");
