import * as common from '../common'
import {GetServerInfoResponse} from '../common/serverinfo'

function isConnected(): boolean {
  return this.connection.isConnected()
}

function getLedgerVersion(): Promise<number> {
  return this.connection.getLedgerVersion()
}

function connect(): Promise<void> {
  return this.connection.connect()
}

function disconnect(): Promise<void> {
  return this.connection.disconnect()
}

function getServerInfo(): Promise<GetServerInfoResponse> {
  return common.serverInfo.getServerInfo(this.connection)
}

function getFee(): Promise<string> {
  const cushion = this._feeCushion || 1.2
  return common.serverInfo.getFee(this.connection, cushion)
}

function formatLedgerClose(ledgerClose: any): Object {
  return {
    feePool: common.dropsToCall(ledgerClose.Fee),
    baseFeeCALL: common.dropsToCall(ledgerClose.fee_base),
    ledgerHash: ledgerClose.ledger_hash,
    ledgerVersion: ledgerClose.ledger_index,
    ledgerTimestamp: common.callTimeToISO8601(ledgerClose.ledger_time),
    reserveBaseCALL: common.dropsToCall(ledgerClose.reserve_base),
    reserveIncrementCALL: common.dropsToCall(ledgerClose.reserve_inc),
    transactionCount: ledgerClose.txn_count,
    validatedLedgerVersions: ledgerClose.validated_ledgers
  }
}

export {
  connect,
  disconnect,
  isConnected,
  getServerInfo,
  getFee,
  getLedgerVersion,
  formatLedgerClose
}
