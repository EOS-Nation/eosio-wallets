import * as anchor from "./anchor";
import * as scatter from "./scatter";
import { Action } from "eosjs/dist/eosjs-serialize";
import { EOSIO_RPCS, EOSIO_CHAIN_IDS, REVERSE_EOSIO_CHAIN_IDS } from "./constants"
import { WalletConfig, WalletAccount, SendTransaction2Options, SendTransaction2Response } from "./interfaces";

export let Config: WalletConfig;

function checkRpcEndpoint(rpcEndpoint: string) {
  if ( !rpcEndpoint.startsWith('http') ) throw new Error("rpcEndpoint must start with http:// or https://");
  try {
    new URL(rpcEndpoint);
  } catch( err ) {
    throw new Error("rpcEndpoint is not a valid URL");
  }
}

export function init( config: WalletConfig ) {
  let rpcEndpoint = config.rpcEndpoint;
  let chainId = config.chainId;
  let blockchain = config.blockchain;

  if ( config.blockchain ) {
    if ( !EOSIO_RPCS.has(config.blockchain) ) throw new Error("blockchain is not supported");
    if ( !rpcEndpoint ) rpcEndpoint = EOSIO_RPCS.get(config.blockchain) || "";
    if ( !chainId ) chainId = EOSIO_CHAIN_IDS.get(config.blockchain) || "";
  } else {
    if ( !chainId ) throw new Error("chainId is not set");
    blockchain = REVERSE_EOSIO_CHAIN_IDS.get(chainId);
  }

  // validate config
  if ( !rpcEndpoint ) throw new Error("rpcEndpoint is required");
  if ( !chainId ) throw new Error("chainId is required");
  if ( !blockchain ) throw new Error("blockchain is required");
  if ( !config.appId ) throw new Error("appId is required");
  if ( !config.appId.match(/^[1-5a-z\.]{2,12}$/) ) throw new Error("appId is invalid (must be 2-12 characters long and contain only lowercase letters, numbers, and dots)");
  checkRpcEndpoint(rpcEndpoint);

  Config = config;
  Config.chainId = chainId;
  Config.rpcEndpoint = rpcEndpoint;
  Config.blockchain = blockchain;

  anchor.init();
  scatter.init();
}


export async function login(walletProtocol: string = "anchor"): Promise<WalletAccount> {

  if ( walletProtocol == "scatter" ) {
    const account = await scatter.login();
    return { actor: account.name, permission: account.authority };
  }
  if ( walletProtocol == "anchor" ) {
    const session = await anchor.login();
    return { actor: session?.auth.actor.toString(), permission: session?.auth.permission.toString() }
  }

  throw new Error("Invalid wallet protocol");
}

export async function logout( ): Promise<void> {
  await Promise.all([
    scatter.disconnect(),
    anchor.disconnect()
  ]);
}

export function pushTransaction(actions: Action[], walletProtocol = "anchor", cosign = false, options?: SendTransaction2Options ): Promise<SendTransaction2Response> {

  // input validation
  if (!walletProtocol) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[walletProtocol] is required" });
  if (!actions) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[actions] is required" });
  if (!actions.length) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[actions] is empty" });
  if (cosign && !Config.cosignEndpoint) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[cosignEndpoint] is not configured" });

  // handle different wallet protocols
  if (walletProtocol == "anchor") return anchor.handleAnchor( actions, cosign, options );
  else if (walletProtocol == "scatter") return scatter.handleScatter( actions, cosign, options );
  throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[walletProtocol] must be 'scatter|anchor'" });
}

export function getWallet() {
  const ethereum = (window as any).ethereum;
  if (ethereum) {
    const { isTokenPocket, isMYKEY, isTrust, isImToken, isMathWallet, isLeafWallet, isCoinbaseWallet, isHbWallet } = ethereum;
    if (isTokenPocket) return 'tokenpocket';
    if (isMYKEY) return 'mykey';
    if (isTrust) return 'start';
    if (isImToken) return 'imtoken';
    if (isMathWallet) return 'math';
    if (isLeafWallet) return 'leaf';        // how to properly detect Leaf?
  }
  if ((window as any).__wombat__) return 'wombat';
  return null;
}

export function getWalletProtocol() {
  switch (getWallet()) {
    case "tokenpocket":
    case "mykey":
    case "wombat":
    case "start":
    case "imtoken":
    case "math":
    case "leaf":
      return "scatter";
  }
  return null;
}
