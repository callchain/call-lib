import {parseQuality} from './utils'
import {removeUndefined} from '../../common'

type Trustline = {
  account: string, limit: number, currency: string, quality_in: number|null,
  quality_out: number|null, no_call: boolean, freeze: boolean,
  authorized: boolean, limit_peer: string, no_call_peer: boolean,
  freeze_peer: boolean, peer_authorized: boolean, balance: any
}

type TrustlineSpecification = {}
type TrustlineCounterParty = {}
type TrustlineState = {balance: number}
type AccountTrustline = {
  specification: TrustlineSpecification, counterparty: TrustlineCounterParty,
  state: TrustlineState
}

function parseAccountTrustline(trustline: Trustline): AccountTrustline {
  const specification = removeUndefined({
    limit: trustline.limit,
    currency: trustline.currency,
    counterparty: trustline.account,
    qualityIn: parseQuality(trustline.quality_in) || undefined,
    qualityOut: parseQuality(trustline.quality_out) || undefined,
    callingDisabled: trustline.no_call || undefined,
    frozen: trustline.freeze || undefined,
    authorized: trustline.authorized || undefined
  })
  const counterparty = removeUndefined({
    limit: trustline.limit_peer,
    callingDisabled: trustline.no_call_peer || undefined,
    frozen: trustline.freeze_peer || undefined,
    authorized: trustline.peer_authorized || undefined
  })
  const state = {
    balance: trustline.balance
  }
  return {specification, counterparty, state}
}

export default parseAccountTrustline
