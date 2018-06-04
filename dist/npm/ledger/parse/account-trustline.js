"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const common_1 = require("../../common");
function hexToStringWide(h) {
    let a = [];
    let i = 0;
    if (h.length % 4) {
        a.push(String.fromCharCode(parseInt(h.substring(0, 4), 16)));
        i = 4;
    }
    for (; i < h.length; i += 4) {
        a.push(String.fromCharCode(parseInt(h.substring(i, i + 4), 16)));
    }
    return a.join('');
}
function parseAccountTrustline(trustline) {
    const specification = common_1.removeUndefined({
        limit: trustline.limit,
        currency: trustline.currency,
        counterparty: trustline.account,
        qualityIn: utils_1.parseQuality(trustline.quality_in) || undefined,
        qualityOut: utils_1.parseQuality(trustline.quality_out) || undefined,
        callingDisabled: trustline.no_call || undefined,
        frozen: trustline.freeze || undefined,
        authorized: trustline.authorized || undefined
    });
    const counterparty = common_1.removeUndefined({
        limit: trustline.limit_peer,
        callingDisabled: trustline.no_call_peer || undefined,
        frozen: trustline.freeze_peer || undefined,
        authorized: trustline.peer_authorized || undefined
    });
    const state = {
        balance: trustline.balance
    };
    const trusts = { specification, counterparty, state };
    if (trustline.NickName) {
        trusts.nickName = {
            nick: hexToStringWide(hexToStringWide(trustline.NickName))
        };
    }
    return trusts;
}
exports.default = parseAccountTrustline;
//# sourceMappingURL=account-trustline.js.map