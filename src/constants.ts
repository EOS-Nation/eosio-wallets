export type Chain = "eos" | "wax" | "telos";

export const IDENTIFIER = "myapp"
export const ANCHOR_FUEL_REFERRER = IDENTIFIER;
export const ANCHOR_IDENTIFIER = IDENTIFIER;
export const SCATTER_IDENTIFIER = IDENTIFIER;

export const EOSIO_RPCS = new Map([
    ['eos', 'https://eos.greymass.com'],
    ['wax', 'https://wax.greymass.com'],
    ['telos', 'https://telos.greymass.com'],
    ['ux', 'https://ux.api.eosnation.io'],
    ['ultra', 'https://ultra.api.eosnation.io'],
    ['ore', 'https://ore.api.eosnation.io'],

    // Testnets
    ['kylin', 'https://kylin.api.eosnation.io'],
    ['jungle4', 'https://jungle4.api.eosnation.io'],
]);

export const EOSIO_CHAIN_IDS = new Map([
    ['eos', 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'],
    ['wax', '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4'],
    ['telos', '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'],
    ['ux', '8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02'],
    ['ultra', 'a9c481dfbc7d9506dc7e87e9a137c931b0a9303f64fd7a1d08b8230133920097'],
    ['ore', '7900eaca71d5b213d3e1e15d54d98ad235a7a5b8166361be78e672edeeb2b47a'],

    // Testnets
    ['kylin', '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'],
    ['jungle4', '73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d'],
]);

export const REVERSE_EOSIO_CHAIN_IDS = new Map(Array.from(EOSIO_CHAIN_IDS.entries()).map(([a, b]) => [b, a]));

export const EOSIO_RPC = EOSIO_RPCS.get("eos");
export const EOSIO_CHAIN_ID = EOSIO_CHAIN_IDS.get("eos");
