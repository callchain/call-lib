import {txFlags, removeUndefined} from '../../common'
import {IssueInfo, AccountIssue} from '../issues-types'
const flags = txFlags.IssueSet

function parseFlag(flagsValue, value) {
    return ((flagsValue & value) !== 0)
}

function parseAccountIssue(issue: IssueInfo): AccountIssue {
  const specification = removeUndefined({
    currency: issue.Total.currency,
    issuer: issue.Total.issuer,
    value: issue.Total.value,
    additional: parseFlag(issue.Flags, flags.Additional),
    invoice: parseFlag(issue.Flags, flags.NonFungible),
    transferRate: issue.TransferRate
  });

  const state = {
    fans: issue.Fans,
    issued: issue.Issued.value,
    freeze: issue.Freeze.value
  };

  const result = {specification, state};

  return result;
}

export default parseAccountIssue
