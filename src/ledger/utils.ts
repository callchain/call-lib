import * as _ from 'lodash'
import * as assert from 'assert'
import * as common from '../common'
import {Connection} from '../common'
import {TransactionType} from './transaction-types'
import {Issue} from '../common/types'

type RecursiveData = {
  marker: String,
  results: Array<any>
}

type Getter = (marker?: String, limit?: number) => Promise<RecursiveData>

function clamp(value: number, min: number, max: number): number {
  assert(min <= max, 'Illegal clamp bounds')
  return Math.min(Math.max(value, min), max)
}

function getCALLBalance(connection: Connection, address: string,
  ledgerVersion?: number
): Promise<string> {
  const request = {
    command: 'account_info',
    account: address,
    ledger_index: ledgerVersion
  }
  return connection.request(request).then(data =>
    common.dropsToCall(data.account_data.Balance))
}

// If the marker is omitted from a response, you have reached the end
function getRecursiveRecur(
  getter: Getter, marker: String, limit: number
): Promise<any> {
  var jobs = getter(marker, limit).then(data => {
    const remaining = limit - data.results.length
    if (remaining > 0 && data.marker !== undefined) {
      return getRecursiveRecur(getter, data.marker, remaining).then((result) =>
      {
        
          data.results = data.results.concat(result["results"]);
          if(result['marker'])
              data.marker = result['marker'];
          else
              delete data.marker;
          return data;
      })
    }
      const obj = {results: data.results};
      if(data.marker){
          obj['marker'] = data.marker;
      }
      
      if(data['nickName'])
          obj['nickName'] = data['nickName'];
      if (data['call_info'])
          obj['call_info'] = data['call_info'];

      return obj;
  });
  return jobs;
}

// function getRecursive(getter: Getter, limit?: number): Promise<Array<any>> {
//   return getRecursiveRecur(getter, undefined, limit || Infinity)
// }

function getRecursive(getter, limit,  marker) {
    return getRecursiveRecur(getter, marker, limit || Infinity);
}

function renameCounterpartyToIssuer<T>(
    obj: T & {counterparty?: string, issuer?: string}
  ): (T & {issuer?: string}) {
  const issuer = (obj.counterparty !== undefined) ?
    obj.counterparty :
    ((obj.issuer !== undefined) ? obj.issuer : undefined)
  const withIssuer = Object.assign({}, obj, {issuer})
  delete withIssuer.counterparty
  return withIssuer
}

type RequestBookOffersArgs = {taker_gets: Issue, taker_pays: Issue}

function renameCounterpartyToIssuerInOrder(order: RequestBookOffersArgs) {
  const taker_gets = renameCounterpartyToIssuer(order.taker_gets)
  const taker_pays = renameCounterpartyToIssuer(order.taker_pays)
  const changes = {taker_gets, taker_pays}
  return _.assign({}, order, _.omitBy(changes, _.isUndefined))
}

function signum(num) {
  return (num === 0) ? 0 : (num > 0 ? 1 : -1)
}
function compareTransactions(first: TransactionType, second: TransactionType
): number {
  if (!first.outcome || !second.outcome) {
    return 0
  }
  if (first.outcome.ledgerVersion === second.outcome.ledgerVersion) {
    return signum(first.outcome.indexInLedger - second.outcome.indexInLedger)
  }
  return first.outcome.ledgerVersion < second.outcome.ledgerVersion ? -1 : 1
}

function hasCompleteLedgerRange(connection: Connection,
  minLedgerVersion?: number, maxLedgerVersion?: number
): Promise<boolean> {
  const firstLedgerVersion = 32570 // earlier versions have been lost
  return connection.hasLedgerVersions(
    minLedgerVersion || firstLedgerVersion, maxLedgerVersion)
}

function isPendingLedgerVersion(connection: Connection,
  maxLedgerVersion?: number
): Promise<boolean> {
  return connection.getLedgerVersion().then(ledgerVersion =>
    ledgerVersion < (maxLedgerVersion || 0))
}

function ensureLedgerVersion(options: any
): Promise<Object> {
  if (Boolean(options) && options.ledgerVersion !== undefined &&
    options.ledgerVersion !== null
  ) {
    return Promise.resolve(options)
  }
  return this.getLedgerVersion().then(ledgerVersion =>
    _.assign({}, options, {ledgerVersion}))
}

function hexToStringWide(h) {
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

export {
  getCALLBalance,
  ensureLedgerVersion,
  compareTransactions,
  renameCounterpartyToIssuer,
  renameCounterpartyToIssuerInOrder,
  getRecursive,
  hasCompleteLedgerRange,
  isPendingLedgerVersion,
  clamp,
  hexToStringWide,
  common
}