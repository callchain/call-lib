"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils = require("./utils");
var transaction_1 = require("./parse/transaction");
var common_1 = require("../common");
function attachTransactionDate(connection, tx) {
    if (tx.date) {
        return Promise.resolve(tx);
    }
    var ledgerVersion = tx.ledger_index || tx.LedgerSequence;
    if (!ledgerVersion) {
        return new Promise(function () {
            throw new common_1.errors.NotFoundError('ledger_index and LedgerSequence not found in tx');
        });
    }
    var request = {
        command: 'ledger',
        ledger_index: ledgerVersion
    };
    return connection.request(request).then(function (data) {
        if (typeof data.ledger.close_time === 'number') {
            return _.assign({ date: data.ledger.close_time }, tx);
        }
        throw new common_1.errors.UnexpectedError('Ledger missing close_time');
    }).catch(function (error) {
        if (error instanceof common_1.errors.UnexpectedError) {
            throw error;
        }
        throw new common_1.errors.NotFoundError('Transaction ledger not found');
    });
}
function isTransactionInRange(tx, options) {
    return (!options.minLedgerVersion
        || tx.ledger_index >= options.minLedgerVersion)
        && (!options.maxLedgerVersion
            || tx.ledger_index <= options.maxLedgerVersion);
}
function convertError(connection, options, error) {
    var _error = (error.message === 'txnNotFound') ?
        new common_1.errors.NotFoundError('Transaction not found') : error;
    if (_error instanceof common_1.errors.NotFoundError) {
        return utils.hasCompleteLedgerRange(connection, options.minLedgerVersion, options.maxLedgerVersion).then(function (hasCompleteLedgerRange) {
            if (!hasCompleteLedgerRange) {
                return utils.isPendingLedgerVersion(connection, options.maxLedgerVersion)
                    .then(function (isPendingLedgerVersion) {
                    return isPendingLedgerVersion ?
                        new common_1.errors.PendingLedgerVersionError() :
                        new common_1.errors.MissingLedgerHistoryError();
                });
            }
            return _error;
        });
    }
    return Promise.resolve(_error);
}
function formatResponse(options, tx) {
    if (tx.validated !== true || !isTransactionInRange(tx, options)) {
        throw new common_1.errors.NotFoundError('Transaction not found');
    }
    return transaction_1.default(tx);
}
function getTransaction(id, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    common_1.validate.getTransaction({ id: id, options: options });
    var request = {
        command: 'tx',
        transaction: id,
        binary: false
    };
    return utils.ensureLedgerVersion.call(this, options).then(function (_options) {
        return _this.connection.request(request).then(function (tx) {
            return attachTransactionDate(_this.connection, tx);
        }).then(_.partial(formatResponse, _options))
            .catch(function (error) {
            return convertError(_this.connection, _options, error).then(function (_error) {
                throw _error;
            });
        });
    });
}
exports.default = getTransaction;
//# sourceMappingURL=transaction.js.map