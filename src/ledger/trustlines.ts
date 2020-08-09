import * as _ from 'lodash'
import * as utils from './utils'
import {validate} from '../common'
import {Connection} from '../common'
import parseAccountTrustline from './parse/account-trustline'
import {TrustlinesOptions, Trustline} from './trustlines-types'

type GetTrustlinesResponse = Array<Trustline>
interface GetAccountLinesResponse {
  marker?: any,
  results: Trustline[]
}

function currencyFilter(currency: string, trustline: Trustline) {
  return currency === null || trustline.specification.currency === currency
}

function formatResponse(options: TrustlinesOptions, data: any) {
    const response = {results: data.lines.map(parseAccountTrustline)
        .filter(_.partial(currencyFilter, options.currency || null))};

    // if(data.marker){
    //     response.marker = data.marker;
    // }
    // if(data.NickName){
    //     response.nickName = hexToStringWide(hexToStringWide(data.NickName));
    // }
    // if(data.call_info){
    //     response.call_info = data.call_info;
    // }
    
    return response;
}

function getAccountLines(connection: Connection, address: string,
  ledgerVersion: number, options: TrustlinesOptions, marker: string,
  limit: number
): Promise<GetAccountLinesResponse> {
  const request = {
    command: 'account_lines',
    account: address,
    ledger_index: ledgerVersion,
    marker: marker,
    limit: utils.clamp(limit, 10, 400),
    peer: options.counterparty
  }

  return connection.request(request).then(_.partial(formatResponse, options))
}

function getTrustlines(address: string, options: TrustlinesOptions = {}
): Promise<GetTrustlinesResponse> {
  validate.getTrustlines({address, options})

  return this.getLedgerVersion().then(ledgerVersion => {
    const getter = _.partial(getAccountLines, this.connection, address,
      options.ledgerVersion || ledgerVersion, options)
    return utils.getRecursive(getter, options.limit,options.currency)
  })
}

export default getTrustlines
