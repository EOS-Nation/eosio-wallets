import { Action, PermissionLevel } from "./interfaces";
import { Config } from './wallet'
import { fetch } from './utils';

export async function cosignTransactionBackend(actions: Action[], signer: PermissionLevel): Promise<{transaction: any, signatures: string[]} | undefined> {
  if ( !Config.cosignEndpoint) return;

  try {
    const resp = await fetch(Config.cosignEndpoint, {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
          transaction: {
            actions
          },
          signer,
          referrer: Config.cosignReferrer ?? ''
      }),
      method: "POST"
    });

    if(resp.status != 200) throw new Error(`Failed to fetch trx from ${Config.rpcEndpoint}. Status: ${resp.status}`);

    const { data } = await resp.json();

    return {
      transaction: data.transaction,
      signatures: data.signatures
    };
  }
  catch (err: any) {
    console.log(`cosignTransactionBackend(): Failed to fetch free cpu.`, err.message ?? err)
    return undefined;
  }
}

