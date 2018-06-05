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

function currencyFilter(currency: string, trustline: Trustline) {
  return currency === null || trustline.specification.currency === currency
}

function formatResponse(options: TrustlinesOptions, data: any) {
    const response = {results: data.lines.map(parseAccountTrustline)
        .filter(_.partial(currencyFilter, options.currency || null))};

    if(data.marker){
        response.marker = data.marker;
    }
    if(data.NickName){
        response.nickName = hexToStringWide(hexToStringWide(data.NickName));
    }
    if(data.call_info){
        response.call_info = data.call_info;
    }
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
    return utils.getRecursive(getter, options.limit)
  })
}

export default getTrustlines
