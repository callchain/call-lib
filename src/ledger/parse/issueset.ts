import * as assert from 'assert'
import {txFlags, removeUndefined} from '../../common'
const flags = txFlags.IssueSet

function parseFlag(flagsValue, value) {
  return ((flagsValue & value) !== 0)
}

function parseIssueSet(tx: any): Object {
  assert(tx.TransactionType === 'IssueSet')

  return removeUndefined({
    currency: tx.Total.currency,
    issuer: tx.Total.issuer,
    total: tx.Total.value,
    additional: parseFlag(tx.Flags, flags.Additional),
    invoice: parseFlag(tx.Flags, flags.NonFungible)
  })
}

export default parseIssueSet
