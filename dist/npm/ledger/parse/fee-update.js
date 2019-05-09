"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var common_1 = require("../../common");
function parseFeeUpdate(tx) {
    var baseFeeDrops = (new bignumber_js_1.default(tx.BaseFee, 16)).toString();
    return {
        baseFeeCALL: common_1.dropsToCall(baseFeeDrops),
        referenceFeeUnits: tx.ReferenceFeeUnits,
        reserveBaseCALL: common_1.dropsToCall(tx.ReserveBase),
        reserveIncrementCALL: common_1.dropsToCall(tx.ReserveIncrement)
    };
}
exports.default = parseFeeUpdate;
//# sourceMappingURL=fee-update.js.map