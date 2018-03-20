"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var common_1 = require("../../common");
function parseFeeUpdate(tx) {
    var baseFeeDrops = (new bignumber_js_1.default(tx.BaseFee, 16)).toString();
    return {
        baseFeeXRP: common_1.dropsToXrp(baseFeeDrops),
        referenceFeeUnits: tx.ReferenceFeeUnits,
        reserveBaseXRP: common_1.dropsToXrp(tx.ReserveBase),
        reserveIncrementXRP: common_1.dropsToXrp(tx.ReserveIncrement)
    };
}
exports.default = parseFeeUpdate;
