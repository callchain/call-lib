
import {Amount, Memo} from '../common/types'

type Outcome = {
  result: string,
  ledgerVersion: number,
  indexInLedger: number,
  fee: string,
  balanceChanges: {
    [key: string]: [{
     currency: string,
     counterparty?: string,
     value: string
    }]
  },
  orderbookChanges: Object,
  timestamp?: string
}

type Adjustment = {
  address: string,
  amount: {
   currency: string,
   counterparty?: string,
   value: string
 },
  tag?: number
}

type Trustline = {
  currency: string,
  counterparty: string,
  limit: string,
  qualityIn?: number,
  qualityOut?: number,
  callingDisabled?: boolean,
  authorized?: boolean,
  frozen?: boolean
}

type Settings = {
  passwordSpent?: boolean,
  requireDestinationTag?: boolean,
  requireAuthorization?: boolean,
  disallowIncomingCALL?: boolean,
  disableMasterKey?: boolean,
  enableTransactionIDTracking?: boolean,
  noFreeze?: boolean,
  globalFreeze?: boolean,
  defaultCall?: boolean,
  emailHash?: string,
  messageKey?: string,
  domain?: string,
  code?: string,
  transferRate?: number,
  regularKey?: string
}

type OrderCancellation = {
  orderSequence: number
}

type Payment = {
  source: Adjustment,
  destination: Adjustment,
  paths?: string,
  memos?: Array<Memo>,
  invoiceID?: string,
  allowPartialPayment?: boolean,
  noDirectCall?: boolean,
  limitQuality?: boolean
}

type PaymentTransaction = {
  type: string,
  specification: Payment,
  outcome: Outcome,
  id: string,
  address: string,
  sequence: number
}

export type Order = {
  direction: string,
  quantity: Amount,
  totalPrice: Amount,
  immediateOrCancel?: boolean,
  fillOrKill?: boolean,
  passive?: boolean,
  expirationTime?: string,
  orderToReplace?: number,
  memos?: Memo[]
}

type OrderTransaction = {
  type: string,
  specification: Order,
  outcome: Outcome,
  id: string,
  address: string,
  sequence: number
}

type OrderCancellationTransaction = {
  type: string,
  specification: OrderCancellation,
  outcome: Outcome,
  id: string,
  address: string,
  sequence: number
}

type TrustlineTransaction = {
  type: string,
  specification: Trustline,
  outcome: Outcome,
  id: string,
  address: string,
  sequence: number
}

type SettingsTransaction = {
  type: string,
  specification: Settings,
  outcome: Outcome,
  id: string,
  address: string,
  sequence: number
}

export type TransactionOptions = {
  minLedgerVersion?: number,
  maxLedgerVersion?: number
}

export type TransactionType = PaymentTransaction | OrderTransaction |
  OrderCancellationTransaction | TrustlineTransaction | SettingsTransaction

export type TransactionResponse = TransactionType & {
  hash: string,
  ledger_index: number,
  meta: any,
  validated?: boolean
}
