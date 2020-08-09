"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var common_1 = require("../../common");
function parseAccountTrustline(trustline) {
    var specification = common_1.removeUndefined({
        limit: trustline.limit,
        currency: trustline.currency,
        counterparty: trustline.account,
        qualityIn: utils_1.parseQuality(trustline.quality_in) || undefined,
        qualityOut: utils_1.parseQuality(trustline.quality_out) || undefined,
        callingDisabled: trustline.no_call || undefined,
        frozen: trustline.freeze || undefined,
        authorized: trustline.authorized || undefined
    });
    var counterparty = common_1.removeUndefined({
        limit: trustline.limit_peer,
        callingDisabled: trustline.no_call_peer || undefined,
        frozen: trustline.freeze_peer || undefined,
        authorized: trustline.peer_authorized || undefined
    });
    var state = {
        balance: trustline.balance
    };
    var trusts = { specification: specification, counterparty: counterparty, state: state };
    // if(trustline.NickName){
    //     trusts.nickName = {
    //         nick: hexToStringWide(hexToStringWide(trustline.NickName))
    //     };
    // }
    return trusts;
}
exports.default = parseAccountTrustline;
//# sourceMappingURL=account-trustline.js.map