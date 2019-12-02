"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var txflags_1 = require("./txflags");
var accountRootFlags = {
    PasswordSpent: 0x00010000,
    RequireDestTag: 0x00020000,
    RequireAuth: 0x00040000,
    DisallowCALL: 0x00080000,
    DisableMaster: 0x00100000,
    NoFreeze: 0x00200000,
    GlobalFreeze: 0x00400000,
    DefaultCall: 0x00800000
};
var AccountFlags = {
    passwordSpent: accountRootFlags.PasswordSpent,
    requireDestinationTag: accountRootFlags.RequireDestTag,
    requireAuthorization: accountRootFlags.RequireAuth,
    disallowIncomingCALL: accountRootFlags.DisallowCALL,
    disableMasterKey: accountRootFlags.DisableMaster,
    noFreeze: accountRootFlags.NoFreeze,
    globalFreeze: accountRootFlags.GlobalFreeze,
    defaultCall: accountRootFlags.DefaultCall
};
exports.AccountFlags = AccountFlags;
var AccountFlagIndices = {
    requireDestinationTag: txflags_1.txFlagIndices.AccountSet.asfRequireDest,
    requireAuthorization: txflags_1.txFlagIndices.AccountSet.asfRequireAuth,
    disallowIncomingCALL: txflags_1.txFlagIndices.AccountSet.asfDisallowCALL,
    disableMasterKey: txflags_1.txFlagIndices.AccountSet.asfDisableMaster,
    enableTransactionIDTracking: txflags_1.txFlagIndices.AccountSet.asfAccountTxnID,
    noFreeze: txflags_1.txFlagIndices.AccountSet.asfNoFreeze,
    globalFreeze: txflags_1.txFlagIndices.AccountSet.asfGlobalFreeze,
    defaultCall: txflags_1.txFlagIndices.AccountSet.asfDefaultCall
};
exports.AccountFlagIndices = AccountFlagIndices;
var AccountFields = {
    EmailHash: { name: 'emailHash', encoding: 'hex',
        length: 32, defaults: '0' },
    MessageKey: { name: 'messageKey' },
    Domain: { name: 'domain', encoding: 'hex' },
    TransferRate: { name: 'transferRate', defaults: 0, shift: 9 },
    NickName: { name: 'nickname' },
    Code: { name: 'code' }
};
exports.AccountFields = AccountFields;
//# sourceMappingURL=constants.js.map