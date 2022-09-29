import * as anchor from "./anchor";
import * as scatter from "./scatter";
import { Action } from "eosjs/dist/eosjs-serialize";

export interface Wallet {
  actor: string;
  permission: string;
  publicKey: string;
  wallet: string;
  protocol: string;
  chain: string;
}

export interface WalletConfig {
  rpcEndpoint: string,
  chainId: string,
  appId: string,
  cosignReferrer?: string,
  cosignEndpoint?: string,
}

export interface WalletAccount {
  actor?: string,
  permission?: string,
}

export let Config: WalletConfig;

export function init( config: WalletConfig ) {

  if(!config.rpcEndpoint.startsWith('http') || config.chainId == '' || config.appId == '') throw new Error("Invalid wallet config");

  try {
    const { protocol } = new URL(config.rpcEndpoint);
  } catch( err ) {
    throw new Error("Invalid wallet config");
  }

  Config = config;

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

export function pushTransaction(actions: Action[], walletProtocol = "anchor", cosign = false, flash: ((message: string, type: 'error'|'success'|'warning'|'info') => void) | undefined = undefined) {

  // input validation
  if (!walletProtocol) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[walletProtocol] is required" });
  if (!actions) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[actions] is required" });
  if (!actions.length) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[actions] is empty" });
  if (cosign && !Config.cosignEndpoint) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[cosignEndpoint] is not configured" });

  // handle different wallet protocols
  if (walletProtocol == "anchor") return anchor.handleAnchor(actions, cosign, flash);
  else if (walletProtocol == "scatter") return scatter.handleScatter(actions, cosign, flash);
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
