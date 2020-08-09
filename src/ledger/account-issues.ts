import * as utils from './utils'
import * as _ from 'lodash'
import {Connection} from '../common'
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
    limit?: number,
    ledgerVersion?: number,
    marker?: string
}

type GetIssuesResponse = Array<IssueItem>
interface GetAccountIssuesResponse {
  marker?: any,
  results: IssueItem[]
}

function formatResponse(options: IssueOptions, data: any) {
    const response = {results: data.lines.map(parseAccountIssue)};

    // if(data.marker){
    //     response.marker = data.marker;
    // }
    // if(data.NickName){
    //     response.nickName = utils.hexToStringWide(data.NickName);
    // }
    // if(data.call_info){
    //     response.call_info = data.call_info;
    // }
    
    return response;
}

function getAccountIssuesInternal(connection: Connection, address: string,
  ledgerVersion: number, options: IssueOptions, marker: string,
  limit: number
): Promise<GetAccountIssuesResponse> {
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
  // TODO validate

  return this.getLedgerVersion().then(ledgerVersion => {
    const getter = _.partial(getAccountIssuesInternal, this.connection, address,
      options.ledgerVersion || ledgerVersion, options)
    return utils.getRecursive(getter, options.limit,options.marker)
  })
}

export default getAccountIssues
