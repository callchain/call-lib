"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var common = require("../common");
exports.common = common;
var txFlags = common.txFlags;
function formatPrepareResponse(txJSON) {
    var instructions = {
        fee: common.dropsToCall(txJSON.Fee),
        sequence: txJSON.Sequence,
    };
    return {
        tx_json: JSON.stringify(txJSON),
        instructions: instructions
    };
}
function setCanonicalFlag(txJSON) {
    txJSON.Flags |= txFlags.Universal.FullyCanonicalSig;
    // JavaScript converts operands to 32-bit signed ints before doing bitwise
    // operations. We need to convert it back to an unsigned int.
    txJSON.Flags = txJSON.Flags >>> 0;
}
function scaleValue(value, multiplier, extra) {
    if (extra === void 0) { extra = 0; }
    return (new bignumber_js_1.default(value)).times(multiplier).plus(extra).toString();
}
function prepareTransaction(txJSON, api, instructions) {
    common.validate.instructions(instructions);
    var account = txJSON.Account;
    //setCanonicalFlag(txJSON)
    // function prepareMaxLedgerVersion(): Promise<Object> {
    //   if (instructions.maxLedgerVersion !== undefined) {
    //     if (instructions.maxLedgerVersion !== null) {
    //       txJSON.LastLedgerSequence = instructions.maxLedgerVersion
    //     }
    //     return Promise.resolve(txJSON)
    //   }
    //   const offset = instructions.maxLedgerVersionOffset !== undefined ?
    //     instructions.maxLedgerVersionOffset : 3
    //   return api.connection.getLedgerVersion().then(ledgerVersion => {
    //     txJSON.LastLedgerSequence = ledgerVersion + offset
    //     return txJSON
    //   })
    // }
    function prepareFee() {
        var multiplier = instructions.signersCount === undefined ? 1 :
            instructions.signersCount + 1;
        if (instructions.fee !== undefined) {
            txJSON.Fee = scaleValue(common.callToDrops(instructions.fee), multiplier);
            return Promise.resolve(txJSON);
        }
        var cushion = api._feeCushion;
        return common.serverInfo.getFee(api.connection, cushion).then(function (fee) {
            return api.connection.getFeeRef().then(function (feeRef) {
                var extraFee = (txJSON.TransactionType !== 'EscrowFinish' ||
                    txJSON.Fulfillment === undefined) ? 0 :
                    (cushion * feeRef * (32 + Math.floor(new Buffer(txJSON.Fulfillment, 'hex').length / 16)));
                var feeDrops = common.callToDrops(fee);
                if (instructions.maxFee !== undefined) {
                    var maxFeeDrops = common.callToDrops(instructions.maxFee);
                    var normalFee = scaleValue(feeDrops, multiplier, extraFee);
                    txJSON.Fee = bignumber_js_1.default.min(normalFee, maxFeeDrops).toString();
                }
                else {
                    txJSON.Fee = scaleValue(feeDrops, multiplier, extraFee);
                }
                return txJSON;
            });
        });
    }
    function prepareSequence() {
        if (instructions.sequence !== undefined) {
            txJSON.Sequence = instructions.sequence;
            return Promise.resolve(txJSON);
        }
        var request = {
            command: 'account_info',
            account: account
        };
        return api.connection.request(request).then(function (response) {
            txJSON.Sequence = response.account_data.Sequence;
            return txJSON;
        });
    }
    function stringToHexWide(s) {
        var result = '';
        for (var i = 0; i < s.length; i++) {
            var b = s.charCodeAt(i);
            if (0 <= b && b < 16) {
                result += '000' + b.toString(16);
            }
            if (16 <= b && b < 255) {
                result += '00' + b.toString(16);
            }
            if (255 <= b && b < 4095) {
                result += '0' + b.toString(16);
            }
            if (4095 <= b && b < 65535) {
                result += b.toString(16);
            }
        }
        return result;
    }
    if (txJSON.NickName) {
        txJSON.NickName = stringToHexWide(stringToHexWide(txJSON.NickName));
    }
    return Promise.all([
        // prepareMaxLedgerVersion(),
        prepareFee(),
        prepareSequence()
    ]).then(function () { return formatPrepareResponse(txJSON); });
}
exports.prepareTransaction = prepareTransaction;
function convertStringToHex(string) {
    return new Buffer(string, 'utf8').toString('hex').toUpperCase();
}
exports.convertStringToHex = convertStringToHex;
function convertMemo(memo) {
    return {
        Memo: common.removeUndefined({
            MemoData: memo.data ? convertStringToHex(memo.data) : undefined,
            MemoType: memo.type ? convertStringToHex(memo.type) : undefined,
            MemoFormat: memo.format ? convertStringToHex(memo.format) : undefined
        })
    };
}
exports.convertMemo = convertMemo;
//# sourceMappingURL=utils.js.map