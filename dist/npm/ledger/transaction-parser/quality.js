"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var bignumber_js_1 = require("bignumber.js");
/*
The quality, as stored in the last 64 bits of a directory index, is stored as
the quotient of TakerPays/TakerGets. It uses drops (1e-6 CALL) for CALL values.
*/
function adjustQualityForCALL(quality, takerGetsCurrency, takerPaysCurrency) {
    var numeratorShift = (takerPaysCurrency === 'CALL' ? -6 : 0);
    var denominatorShift = (takerGetsCurrency === 'CALL' ? -6 : 0);
    var shift = numeratorShift - denominatorShift;
    return shift === 0 ? (new bignumber_js_1.default(quality)).toString() :
        (new bignumber_js_1.default(quality)).shift(shift).toString();
}
function parseQuality(qualityHex, takerGetsCurrency, takerPaysCurrency) {
    assert(qualityHex.length === 16);
    var mantissa = new bignumber_js_1.default(qualityHex.substring(2), 16);
    var offset = parseInt(qualityHex.substring(0, 2), 16) - 100;
    var quality = mantissa.toString() + 'e' + offset.toString();
    return adjustQualityForCALL(quality, takerGetsCurrency, takerPaysCurrency);
}
exports.parseQuality = parseQuality;
//# sourceMappingURL=quality.js.map