import { Action } from "eosjs/dist/eosjs-serialize";

export { Action };
export interface Wallet {
    actor: string;
    permission: string;
    publicKey: string;
    wallet: string;
    protocol: string;
    chain: string;
}

export interface WalletConfig {
    appId: string;
    blockchain?: string;
    rpcEndpoint?: string;
    chainId?: string;
    cosignReferrer?: string;
    cosignEndpoint?: string;
}

export interface WalletAccount {
    actor?: string,
    permission?: string,
}

export interface SendTransaction2Options {
    return_failure_trace?: boolean;
    retry_trx?: boolean;
    retry_trx_num_blocks?: number;
}

export interface Receipt {
    status: string;
    cpu_usage_us: number;
    net_usage_words: number;
}

export interface Authorization {
    actor: string;
    permission: string;
}

export interface Act {
    account: string;
    name: string;
    authorization: Authorization[];
    data: any;
    hex_data: string;
}

export interface AccountRamDelta {
    account: string;
    delta: number;
}

export interface ActionTrace {
    action_ordinal: number;
    creator_action_ordinal: number;
    closest_unnotified_ancestor_action_ordinal: number;
    receipt: {
        receiver: string;
        act_digest: string;
        global_sequence: string;
        recv_sequence: number;
        auth_sequence: any[][];
        code_sequence: number;
        abi_sequence: number;
    };
    receiver: string;
    act: Act;
    context_free: boolean;
    elapsed: number;
    console: string;
    trx_id: string;
    block_num: number;
    block_time: Date;
    producer_block_id?: any;
    account_ram_deltas: AccountRamDelta[];
    except?: any;
    error_code?: any;
    return_value_hex_data: string;
}

export interface Processed {
    id: string;
    block_num: number;
    block_time: Date;
    producer_block_id?: any;
    receipt: Receipt;
    elapsed: number;
    net_usage: number;
    scheduled: boolean;
    action_traces: ActionTrace[];
    account_ram_delta?: any;
    except?: any;
    error_code?: any;
}

export interface SendTransaction2Response {
    transaction_id: string;
    processed?: Processed;
}
