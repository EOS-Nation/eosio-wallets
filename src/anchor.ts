import fetchPonyfill from 'fetch-ponyfill';
import AnchorLink, { LinkSession } from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'
import { SignedTransaction } from "anchor-link";
import { Action } from "eosjs/dist/eosjs-serialize";
import { Config } from './wallet'
import { cosignTransactionBackend } from "./cosign";
import { SendTransaction2Options, SendTransaction2Response } from "./interfaces";
const { fetch } = fetchPonyfill();
global.fetch = fetch;

let link: AnchorLink;

export function init() {
  if ( !Config.chainId ) throw new Error("Chain ID is not set");
  if ( !Config.rpcEndpoint ) throw new Error("RPC endpoint is not set");
  if ( !Config.appId ) throw new Error("App ID is not set");

  link = new AnchorLink({
    transport: new AnchorLinkBrowserTransport({
      fuelReferrer: Config.appId,
      requestStatus: false,
    }),
    chains: [
      {
        chainId: Config.chainId,
        nodeUrl: Config.rpcEndpoint,
      }
    ],
  })
}

export async function handleAnchor(actions: Action[], cosign = false, options?: SendTransaction2Options ): Promise<SendTransaction2Response> {
  const session = await login();
  if (!session) return { transaction_id: '' }

  const cosigned = cosign ? await cosignTransactionBackend(actions, {actor: session.auth.actor.toString(), permission: session.auth.permission.toString()}) : false;
  if (!cosigned) {
    // if failed to cosign - just sign via wallet
    const { transaction } = await session.transact({ actions });
    return {transaction_id: transaction.id.toString()};
  }

  // submit to anchor for user to sign without broadcasting
  const local = await session.transact({ ... cosigned.transaction }, { broadcast: false });

  // merge signatures and broadcast the transaction
  const response: any = await session.client.v1.chain.send_transaction2(
    SignedTransaction.from({
      ...local.transaction,
      signatures: [
        ...local.signatures,
        ...cosigned.signatures,
      ]
    }), options
  );
  return response;
}


export async function getAccount() {
  return sessionToAccount(await login());
}

export async function disconnect() {
  try {
    await link.clearSessions(Config.appId);
  } catch (err) {
    console.log("anchor::disconnect failed", {err});
  }
};

function sessionToAccount( session: LinkSession | null ) {
  if ( !session ) return {};
  const { auth, publicKey } = session;
  const { actor, permission } = auth;
  return { actor: actor.toString(), permission: permission.toString(), publicKey: publicKey.toString(), authorization: auth.toString() }
}

export async function login() {
  const sessions = await link.listSessions(Config.appId);
  if (sessions.length) return await link.restoreSession(Config.appId);
  else return (await link.login(Config.appId)).session
}