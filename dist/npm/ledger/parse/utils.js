"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var transactionParser = require("call-lib-transactionparser");
var bignumber_js_1 = require("bignumber.js");
var common = require("../../common");
var amount_1 = require("./amount");
function adjustQualityForCALL(quality, takerGetsCurrency, takerPaysCurrency) {
    // quality = takerPays.value/takerGets.value
    // using drops (1e-6 CALL) for CALL values
    var numeratorShift = (takerPaysCurrency === 'CALL' ? -6 : 0);
    var denominatorShift = (takerGetsCurrency === 'CALL' ? -6 : 0);
    var shift = numeratorShift - denominatorShift;
    return shift === 0 ? quality :
        (new bignumber_js_1.default(quality)).shift(shift).toString();
}
exports.adjustQualityForCALL = adjustQualityForCALL;
function parseQuality(quality) {
    if (typeof quality !== 'number') {
        return undefined;
    }
    return (new bignumber_js_1.default(quality)).shift(-9).toNumber();
}
exports.parseQuality = parseQuality;
function parseTimestamp(callTime) {
    if (typeof callTime !== 'number') {
        return undefined;
    }
    return common.callTimeToISO8601(callTime);
}
exports.parseTimestamp = parseTimestamp;
function removeEmptyCounterparty(amount) {
    if (amount.counterparty === '') {
        delete amount.counterparty;
    }
}
function removeEmptyCounterpartyInBalanceChanges(balanceChanges) {
    _.forEach(balanceChanges, function (changes) {
        _.forEach(changes, removeEmptyCounterparty);
    });
}
function removeEmptyCounterpartyInOrderbookChanges(orderbookChanges) {
    _.forEach(orderbookChanges, function (changes) {
        _.forEach(changes, function (change) {
            _.forEach(change, removeEmptyCounterparty);
        });
    });
}
function isPartialPayment(tx) {
    return (tx.Flags & common.txFlags.Payment.PartialPayment) !== 0;
}
exports.isPartialPayment = isPartialPayment;
function parseDeliveredAmount(tx) {
    if (tx.TransactionType !== 'Payment' ||
        tx.meta.TransactionResult !== 'tesSUCCESS') {
        return undefined;
    }
    if (tx.meta.delivered_amount &&
        tx.meta.delivered_amount === 'unavailable') {
        return undefined;
    }
    // parsable delivered_amount
    if (tx.meta.delivered_amount) {
        return amount_1.default(tx.meta.delivered_amount);
    }
    // DeliveredAmount only present on partial payments
    if (tx.meta.DeliveredAmount) {
        return amount_1.default(tx.meta.DeliveredAmount);
    }
    // no partial payment flag, use tx.Amount
    if (tx.Amount && !isPartialPayment(tx)) {
        return amount_1.default(tx.Amount);
    }
    // DeliveredAmount field was introduced at
    // ledger 4594095 - after that point its absence
    // on a tx flagged as partial payment indicates
    // the full amount was transferred. The amount
    // transferred with a partial payment before
    // that date must be derived from metadata.
    if (tx.Amount && tx.ledger_index > 4594094) {
        return amount_1.default(tx.Amount);
    }
    return undefined;
}
function parseOutcome(tx) {
    var metadata = tx.meta || tx.metaData;
    if (!metadata) {
        return undefined;
    }
    var balanceChanges = transactionParser.parseBalanceChanges(metadata);
    var orderbookChanges = transactionParser.parseOrderbookChanges(metadata);
    removeEmptyCounterpartyInBalanceChanges(balanceChanges);
    removeEmptyCounterpartyInOrderbookChanges(orderbookChanges);
    return common.removeUndefined({
        result: tx.meta.TransactionResult,
        timestamp: parseTimestamp(tx.date),
        fee: common.dropsToCall(tx.Fee),
        balanceChanges: balanceChanges,
        orderbookChanges: orderbookChanges,
        ledgerVersion: tx.ledger_index,
        indexInLedger: tx.meta.TransactionIndex,
        deliveredAmount: parseDeliveredAmount(tx)
    });
}
exports.parseOutcome = parseOutcome;
function hexToString(hex) {
    return hex ? new Buffer(hex, 'hex').toString('utf-8') : undefined;
}
exports.hexToString = hexToString;
function parseMemos(tx) {
    if (!Array.isArray(tx.Memos) || tx.Memos.length === 0) {
        return undefined;
    }
    return tx.Memos.map(function (m) {
        return common.removeUndefined({
            type: m.Memo.parsed_memo_type || hexToString(m.Memo.MemoType),
            format: m.Memo.parsed_memo_format || hexToString(m.Memo.MemoFormat),
            data: m.Memo.parsed_memo_data || hexToString(m.Memo.MemoData)
        });
    });
}
exports.parseMemos = parseMemos;
//# sourceMappingURL=utils.js.map