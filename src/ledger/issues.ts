import * as utils from './utils'
import * as _ from 'lodash'
import {Connection, validate} from '../common'
import parseAccountIssue from './parse/account-issue'


type IssueSpecification = {
    currency: string,
    issuer: string,
    value: string,
    additional?: boolean,
    invoice?: boolean,
    transferRate: string,
}

type IssueItem = {
    specification: IssueSpecification,
    state: {
        fans: string,
        value: string,
        freeze?: string
    }
}

type IssueOptions = {
    invoice?: boolean,
    limit?: number,
    ledgerVersion?: number,
    marker?: string
}

type GetIssuesResponse = Array<IssueItem>
// interface GetAccountIssuesResponse {
//   marker?: any,
//   results: IssueItem[]
// }

function currencyFilter(invoice: boolean, issue: IssueItem) {
  return invoice === null || issue.specification.invoice === invoice
}

function formatResponse(options: IssueOptions, data: any) {
    const response = {results: data.lines.map(parseAccountIssue)
      .filter(_.partial(currencyFilter, options.invoice || null))};

    if(data.marker){
        response['marker'] = data.marker;
    }

    return response;
}

function getAccountIssuesInternal(connection: Connection, address: string,
  ledgerVersion: number, options: IssueOptions, marker: string,
  limit: number
): Promise<any> {
  const request = {
    command: 'account_issues',
    account: address,
    ledger_index: ledgerVersion,
    marker: marker,
    limit: utils.clamp(limit, 10, 400),
  }

  return connection.request(request).then(_.partial(formatResponse, options))
}

function getAccountIssues(address: string, options: IssueOptions = {}
): Promise<GetIssuesResponse> {
  validate.getIssues({address, options})

  return this.getLedgerVersion().then(ledgerVersion => {
    const getter = _.partial(getAccountIssuesInternal, this.connection, address,
      options.ledgerVersion || ledgerVersion, options)
    return utils.getRecursive(getter, options.limit)
  })
}

export default getAccountIssues
