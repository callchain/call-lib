"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var txFlags = {
    // Universal flags can apply to any transaction type
    Universal: {
        FullyCanonicalSig: 0x80000000
    },
    AccountSet: {
        RequireDestTag: 0x00010000,
        OptionalDestTag: 0x00020000,
        RequireAuth: 0x00040000,
        OptionalAuth: 0x00080000,
        DisallowCALL: 0x00100000,
        AllowCALL: 0x00200000
    },
    TrustSet: {
        SetAuth: 0x00010000,
        NoCall: 0x00020000,
        SetNoCall: 0x00020000,
        ClearNoCall: 0x00040000,
        SetFreeze: 0x00100000,
        ClearFreeze: 0x00200000
    },
    OfferCreate: {
        Passive: 0x00010000,
        ImmediateOrCancel: 0x00020000,
        FillOrKill: 0x00040000,
        Sell: 0x00080000
    },
    Payment: {
        NoCallDirect: 0x00010000,
        PartialPayment: 0x00020000,
        LimitQuality: 0x00040000
    },
    PaymentChannelClaim: {
        Renew: 0x00010000,
        Close: 0x00020000
    },
    IssueSet: {
        Additional: 0x00010000,
        NonFungible: 0x00001000
    }
};
exports.txFlags = txFlags;
// The following are integer (as opposed to bit) flags
// that can be set for particular transactions in the
// SetFlag or ClearFlag field
var txFlagIndices = {
    AccountSet: {
        asfRequireDest: 1,
        asfRequireAuth: 2,
        asfDisallowCALL: 3,
        asfDisableMaster: 4,
        asfAccountTxnID: 5,
        asfNoFreeze: 6,
        asfGlobalFreeze: 7,
        asfDefaultCall: 8
    }
};
exports.txFlagIndices = txFlagIndices;
//# sourceMappingURL=txflags.js.map