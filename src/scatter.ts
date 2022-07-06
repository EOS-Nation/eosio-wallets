import { ScatterJS, ScatterEOS, Action, ScatterAccount, Network } from 'scatter-ts';
import { JsonRpc, Api } from 'eosjs';
import { Config } from './wallet'
import { cosignTransactionBackend } from './cosign'
import { Transaction, TransactResult } from 'eosjs/dist/eosjs-api-interfaces';
import { PushTransactionArgs } from 'eosjs/dist/eosjs-rpc-interfaces';

let network: Network;
let rpc: JsonRpc;

export async function init() {

  ScatterJS.plugins(new ScatterEOS());

  const { host, protocol } = new URL(Config.rpcEndpoint);
  network = ScatterJS.Network.fromJson({
      blockchain: 'eos',
      protocol: (protocol.replace(":", '') as "http"|"https"),
      host,
      port: protocol == "https:" ? 443 : 80,
      chainId: Config.chainId
  });

  rpc = new JsonRpc(network.fullhost(), {fetch});
}


export async function handleScatter(actions: Action[], cosign: boolean, flash: ((message: string, type: 'error'|'success'|'warning'|'info') => void) | undefined) {
  const account = await login();

  const cosigned = cosign ? await cosignTransactionBackend(actions, { actor: account.name, permission: account.authority }) : false;
  if (!cosigned) {
    // if failed to cosign - just sign via wallet
    const { transaction_id } = (await transact(actions) as any)
    return transaction_id;
  }

  // sign with scatter wallet without broadcasting
  const signed = await sign(cosigned.transaction)

  // add backend signature
  signed.signatures.push( cosigned.signatures[0] )

  // broadcast the transaction
  const response = await push(signed)
  return response.transaction_id;
}



export function getApi() {
  return ScatterJS.eos(network, Api, { rpc });
}

export async function transact(actions: Action[]) {
    const options = { blocksBehind: 3, expireSeconds: 30 };
    const api = getApi();

    return api.transact({ actions }, options);
}


export async function sign(transaction: Transaction) {
  const api = getApi();
  // init ABIs, serialize trx
  const serializedTransaction = api.serializeTransaction(transaction);

  // get keys
  const requiredKeys = await api.signatureProvider.getAvailableKeys()
  const signArgs = {
    chainId: api.chainId || Config.chainId,   //some wallets don't provide chain id, so assume EOS mainnet
    requiredKeys,
    serializedTransaction,
    abis: [],
  }

  // sign trx
  const pushTransactionArgs = await api.signatureProvider.sign(signArgs)

  return pushTransactionArgs;
}


export async function push(transaction: PushTransactionArgs) {
  const api = getApi();
  return await api.pushSignedTransaction(transaction) as TransactResult;
}

export async function connect() {
    const connected = await ScatterJS.connect(Config.appId, { network, allowHttp: true });
    if (!connected) throw "Can't connect to Scatter";
    return connected;
}

export async function login() {
    console.log("scatter::login");
    await connect();
    const id = await ScatterJS.login();
    if (!id) throw "No Scatter ID";
    const account: ScatterAccount = ScatterJS.account('eos');
    if (!account) throw "No Scatter Account";
    return account;
};

export async function disconnect() {
  console.log("scatter::disconnect");
  if ( ScatterJS.scatter && ScatterJS.scatter.forgetIdentity ) {
    await ScatterJS.scatter.forgetIdentity();
  }
};

export async function getAccount() {
    const { name, authority, publicKey } = await login();
    return { actor: name, permission: authority, publicKey, authorization: `${name}@${authority}` };
}

export async function getChain() {
    const { blockchain, chainId } = await login();
    return { blockchain, chainId };
}