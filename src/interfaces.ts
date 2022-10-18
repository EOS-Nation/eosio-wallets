export interface Transaction {
    expiration?: string;
    ref_block_num?: number;
    ref_block_prefix?: number;
    max_net_usage_words?: number;
    max_cpu_usage_ms?: number;
    delay_sec?: number;
    context_free_actions?: Action[];
    context_free_data?: Uint8Array[];
    actions: Action[];
    transaction_extensions?: [number, string][];
    resource_payer?: ResourcePayer;
}

/** Arguments for `push_transaction` */
export interface PushTransactionArgs {
    signatures: string[];
    compression?: number;
    serializedTransaction: Uint8Array;
    serializedContextFreeData?: Uint8Array;
}

export interface TransactResult {
    transaction_id: string;
    processed: TransactionTrace;
}

export interface TransactionReceiptHeader {
    status: string;
    cpu_usage_us: number;
    net_usage_words: number;
}

export interface TransactionTrace {
    id: string;
    block_num: number;
    block_time: string;
    producer_block_id: string | null;
    receipt: TransactionReceiptHeader | null;
    elapsed: number;
    net_usage: number;
    scheduled: boolean;
    action_traces: ActionTrace[];
    account_ram_delta: AccountDelta | null;
    except: string | null;
    error_code: number | null;
    bill_to_accounts: string[];
}

export interface AccountDelta {
    account: string;
    delta: number;
}

export interface ResourcePayer {
    payer: string;
    max_net_bytes: number;
    max_cpu_us: number;
    max_memory_bytes: number;
}

export interface PermissionLevel {
    actor: string;
    permission: string;
}

export interface Action {
    account: string;
    name: string;
    authorization: Authorization[];
    data: any;
}

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
