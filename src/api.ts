import * as _ from 'lodash'
import {EventEmitter} from 'events'
import {Connection, errors, validate} from './common'
import * as server from './server/server'
const connect = server.connect
const disconnect = server.disconnect
const getServerInfo = server.getServerInfo
const getFee = server.getFee
const isConnected = server.isConnected
const getLedgerVersion = server.getLedgerVersion
import getTransaction from './ledger/transaction'
import getTransactions from './ledger/transactions'
import getTrustlines from './ledger/trustlines'
import getBalances from './ledger/balances'
import getBalanceSheet from './ledger/balance-sheet'
import getPaths from './ledger/pathfind'
import getOrders from './ledger/orders'
import getOrderbook from './ledger/orderbook'
import getSettings from './ledger/settings'
import getAccountInfo from './ledger/account-info'
import getAccountByName from './ledger/nickname'
import getAccountIssues from './ledger/issues'
import getAccountInvoices from './ledger/account-invoices'
import preparePayment from './transaction/payment'
import prepareTrustline from './transaction/trustline'
import prepareOrder from './transaction/order'
import prepareOrderCancellation from './transaction/ordercancellation'
import prepareSettings from './transaction/settings'
import prepareIssueSet from './transaction/issue-set'
import sign from './transaction/sign'
import combine from './transaction/combine'
import submit from './transaction/submit'
import {generateAddressAPI} from './offline/generate-address'
import {fromSecret} from './offline/address-fromSecret'
import computeLedgerHash from './offline/ledgerhash'
import getLedger from './ledger/ledger'

import RangeSet from './common/rangeset'
import * as ledgerUtils from './ledger/utils'
import * as schemaValidator from './common/schema-validator'

type APIOptions = {
  server?: string,
  feeCushion?: number,
  trace?: boolean,
  proxy?: string,
  timeout?: number
}

// prevent access to non-validated ledger versions
class RestrictedConnection extends Connection {
  request(request: any, timeout?: number) {
    const ledger_index = request.ledger_index
    if (ledger_index !== undefined && ledger_index !== 'validated') {
      if (!_.isNumber(ledger_index) || ledger_index > this._ledgerVersion) {
        return Promise.reject(new errors.LedgerVersionError(
          `ledgerVersion ${ledger_index} is greater than server\'s ` +
          `most recent validated ledger: ${this._ledgerVersion}`))
      }
    }
    return super.request(request, timeout)
  }
}

class CallAPI extends EventEmitter {

  _feeCushion: number
  connection: RestrictedConnection

  // these are exposed only for use by unit tests; they are not part of the API.
  static _PRIVATE = {
    validate: validate,
    RangeSet,
    ledgerUtils,
    schemaValidator
  }

  constructor(options: APIOptions = {}) {
    super()
    validate.apiOptions(options)
    this._feeCushion = options.feeCushion || 1.2
    const serverURL = options.server
    if (serverURL !== undefined) {
      this.connection = new RestrictedConnection(serverURL, options)
      this.connection.on('ledgerClosed', message => {
        this.emit('ledger', server.formatLedgerClose(message))
      });
      this.connection.on('transaction', message => {
          this.emit('transactions', message);
      });
      this.connection.on('error', (errorCode, errorMessage, data) => {
        this.emit('error', errorCode, errorMessage, data)
      });
      this.connection.on('connected', () => {
        this.emit('connected')
      });
      this.connection.on('disconnected', code => {
        this.emit('disconnected', code)
      })
    } else {
      // use null object pattern to provide better error message if user
      // tries to call a method that requires a connection
      this.connection = new RestrictedConnection(null, options)
    }
  }

  connect = connect
  disconnect = disconnect
  isConnected = isConnected
  getServerInfo = getServerInfo
  getFee = getFee
  getLedgerVersion = getLedgerVersion

  getTransaction = getTransaction
  getTransactions = getTransactions
  getTrustlines = getTrustlines
  getBalances = getBalances
  getBalanceSheet = getBalanceSheet
  getPaths = getPaths
  getOrders = getOrders
  getOrderbook = getOrderbook
  getSettings = getSettings
  getAccountInfo = getAccountInfo
  getAccountByName = getAccountByName
  getAccountIssues = getAccountIssues
  getAccountInvoices = getAccountInvoices
  getLedger = getLedger

  prepareIssueSet = prepareIssueSet
  preparePayment = preparePayment
  prepareTrustline = prepareTrustline
  prepareOrder = prepareOrder
  prepareOrderCancellation = prepareOrderCancellation
  prepareSettings = prepareSettings
  sign = sign
  combine = combine
  submit = submit

  generateAddress = generateAddressAPI
  fromSecret = fromSecret
  computeLedgerHash = computeLedgerHash
  errors = errors
}

export {
  CallAPI
}
