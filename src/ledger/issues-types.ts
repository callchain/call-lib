import {Amount} from '../common/types'

export type IssueSpecification = {
    currency: string,
    issuer: string,
    value: string,
    additional?: boolean,
    invoice?: boolean,
    transferRate: string,
}

export type IssueItem = {
    specification: IssueSpecification,
    state: {
        fans: string,
        value: string,
        freeze?: string
    }
}

export type IssueOptions = {
    invoice?: boolean,
    limit?: number,
    ledgerVersion?: number,
    marker?: string
}

export type IssueInfo = {
    Fans: string,
    Flags: string,
    Freeze: Amount,
    Issued: Amount,
    Total: Amount,
    TransferRate: string
}

export type IssueState = {
    fans: string,
    issued: string,
    freeze?: string
}

export type AccountIssue = {
    specification: IssueSpecification,
    state: IssueState
}