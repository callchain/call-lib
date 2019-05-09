"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common = require("../common");
function isConnected() {
    return this.connection.isConnected();
}
exports.isConnected = isConnected;
function getLedgerVersion() {
    return this.connection.getLedgerVersion();
}
exports.getLedgerVersion = getLedgerVersion;
function connect() {
    return this.connection.connect();
}
exports.connect = connect;
function disconnect() {
    return this.connection.disconnect();
}
exports.disconnect = disconnect;
function getServerInfo() {
    return common.serverInfo.getServerInfo(this.connection);
}
exports.getServerInfo = getServerInfo;
function getFee() {
    var cushion = this._feeCushion || 1.2;
    return common.serverInfo.getFee(this.connection, cushion);
}
exports.getFee = getFee;
function formatLedgerClose(ledgerClose) {
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
    };
}
exports.formatLedgerClose = formatLedgerClose;
//# sourceMappingURL=server.js.map