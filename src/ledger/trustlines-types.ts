import {Memo} from '../common/types'

export type TrustLineSpecification = {
  currency: string,
  counterparty: string,
  limit: string,
  qualityIn?: number,
  qualityOut?: number,
  callingDisabled?: boolean,
  authorized?: boolean,
  frozen?: boolean,
  memos?: Memo[]
}

export type Trustline = {
  specification: TrustLineSpecification,
  counterparty: {
    limit: string,
    callingDisabled?: boolean,
    frozen?: boolean,
    authorized?: boolean
  },
  state: {
    balance: string
  }
}

export type TrustlinesOptions = {
  counterparty?: string,
  currency?: string,
  limit?: number,
  ledgerVersion?: number
}
