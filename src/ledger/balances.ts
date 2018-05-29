import * as utils from './utils'
import {validate} from '../common'
import {Connection} from '../common'
import {TrustlinesOptions, Trustline} from './trustlines-types'


type Balance = {
  value: string,
  currency: string,
  counterparty?: string
}

type GetBalances = Array<Balance>

function getTrustlineBalanceAmount(trustline: Trustline) {
  return {
    currency: trustline.specification.currency,
    counterparty: trustline.specification.counterparty,
    value: trustline.state.balance
  }
}

function formatBalances(options, balances) {
  const result = balances.trustlines.results.map(getTrustlineBalanceAmount)
  if (!(options.counterparty ||
       (options.currency && options.currency !== 'CALL')
  )) {
    const callBalance = {
      currency: 'CALL',
      value: balances.call
    }
    result.unshift(callBalance)
  }
  if (options.limit && result.length > options.limit) {
    const toRemove = result.length - options.limit
    result.splice(-toRemove, toRemove)
  }
  return result
}

function getLedgerVersionHelper(connection: Connection, optionValue?: number
): Promise<number> {
  if (optionValue !== undefined && optionValue !== null) {
    return Promise.resolve(optionValue)
  }
  return connection.getLedgerVersion()
}

function getBalances(address: string, options: TrustlinesOptions = {}
): Promise<GetBalances> {
  validate.getTrustlines({address, options})

  return Promise.all([
    getLedgerVersionHelper(this.connection, options.ledgerVersion).then(
      ledgerVersion =>
        utils.getCALLBalance(this.connection, address, ledgerVersion)),
    this.getTrustlines(address, options)
  ]).then(results =>
    formatBalances(options, {call: results[0], trustlines: results[1]}))
}

export default getBalances
