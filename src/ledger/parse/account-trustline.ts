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

function hexToStringWide(h) {//16进制转中英文
    let a = [];
    let i = 0;
    if (h.length % 4) {
        a.push(String.fromCharCode(parseInt(h.substring(0, 4), 16)));
        i = 4;
    }
    for (; i<h.length; i+=4) {
        a.push(String.fromCharCode(parseInt(h.substring(i, i+4), 16)));
    }
    return a.join('');
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
  });
  const counterparty = removeUndefined({
    limit: trustline.limit_peer,
    callingDisabled: trustline.no_call_peer || undefined,
    frozen: trustline.freeze_peer || undefined,
    authorized: trustline.peer_authorized || undefined
  });
  const state = {
    balance: trustline.balance
  };
  const trusts = {specification, counterparty, state};
  if(trustline.NickName){
      trusts.nickName = {
          nick: hexToStringWide(hexToStringWide(trustline.NickName))
      };
  }
  return trusts;
}

export default parseAccountTrustline
