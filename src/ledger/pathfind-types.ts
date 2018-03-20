
import {Amount, LaxLaxAmount, CalledAmount, Adjustment, MaxAdjustment,
  MinAdjustment} from '../common/types'


export type Path = {
  source: Adjustment | MaxAdjustment,
  destination: Adjustment | MinAdjustment,
  paths: string
}

export type GetPaths = Array<Path>

export type PathFind = {
  source: {
    address: string,
    amount?: Amount,
    currencies?: Array<{currency: string, counterparty?:string}>
  },
  destination: {
    address: string,
    amount: LaxLaxAmount
  }
}

export type PathFindRequest = {
  command: string,
  source_account: string,
  destination_amount: CalledAmount,
  destination_account: string,
  source_currencies?: {currency: string, issuer?: string}[],
  send_max?: CalledAmount
}

export type CalledPathsResponse = {
  alternatives: Array<{
    paths_computed: Array<Array<{
      type: number,
      type_hex: string,
      account?: string,
      issuer?: string,
      currency?: string
    }>>,
    source_amount: CalledAmount
  }>,
  type: string,
  destination_account: string,
  destination_amount: CalledAmount,
  destination_currencies?: Array<string>,
  source_account: string,
  source_currencies?: Array<{currency: string}>,
  full_reply?: boolean
}
