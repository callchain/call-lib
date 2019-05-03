import * as _ from 'lodash'
import {CallAPI} from './api'

class CallAPIBroadcast extends CallAPI {

  ledgerVersion: number | undefined = undefined
  private _apis: CallAPI[]

  constructor(servers, options) {
    super(options)

    const apis: CallAPI[] = servers.map(server => new CallAPI(
      _.assign({}, options, {server})
    ))

    // exposed for testing
    this._apis = apis

    this.getMethodNames().forEach(name => {
      this[name] = function() { // eslint-disable-line no-loop-func
        return Promise.race(apis.map(api => api[name](...arguments)))
      }
    })

    // connection methods must be overridden to apply to all api instances
    this.connect = async function() {
      await Promise.all(apis.map(api => api.connect()))
    }
    this.disconnect = async function() {
      await Promise.all(apis.map(api => api.disconnect()))
    }
    this.isConnected = function() {
      return apis.map(api => api.isConnected()).every(Boolean)
    }

    // synchronous methods are all passed directly to the first api instance
    const defaultAPI = apis[0]
    const syncMethods = ['sign', 'generateAddress', 'computeLedgerHash']
    syncMethods.forEach(name => {
      this[name] = defaultAPI[name].bind(defaultAPI)
    })

    apis.forEach(api => {
      api.on('ledger', this.onLedgerEvent.bind(this))
      api.on('error', (errorCode, errorMessage, data) =>
        this.emit('error', errorCode, errorMessage, data))
    })
  }

  onLedgerEvent(ledger) {
    if (ledger.ledgerVersion > this.ledgerVersion ||
        this.ledgerVersion === undefined) {
      this.ledgerVersion = ledger.ledgerVersion
      this.emit('ledger', ledger)
    }
  }

  getMethodNames() {
    const methodNames: string[] = []
    const CallAPI = this._apis[0]
    for (const name of Object.getOwnPropertyNames(CallAPI)) {
      if (typeof CallAPI[name] === 'function') {
        methodNames.push(name)
      }
    }
    return methodNames
  }
}

export {
    CallAPIBroadcast
}
