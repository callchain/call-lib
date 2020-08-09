import {txFlags, removeUndefined} from '../../common'
const flags = txFlags.IssueSet

type IssueItem = {
    currency: string,
    issuer: string, 
    value: string,
}

type IssueInfo = {
    Fans: string,
    Flags: string,
    Freeze: IssueItem,
    Issued: IssueItem,
    Total: IssueItem,
    TransferRate: string
}

type IssueSpecification = {}

type IssueState = {
    fans: string,
    issued: string,
    freeze?: string
}

type AccountIssue = {
    specification: IssueSpecification, state: IssueState
}

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
