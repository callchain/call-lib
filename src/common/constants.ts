
import {txFlagIndices} from './txflags'

const accountRootFlags = {
  PasswordSpent: 0x00010000, // password set fee is spent
  RequireDestTag: 0x00020000, // require a DestinationTag for payments
  RequireAuth: 0x00040000, // require a authorization to hold IOUs
  DisallowCALL: 0x00080000, // disallow sending CALL
  DisableMaster: 0x00100000, // force regular key
  NoFreeze: 0x00200000, // permanently disallowed freezing trustlines
  GlobalFreeze: 0x00400000, // trustlines globally frozen
  DefaultCall: 0x00800000
}

const AccountFlags = {
  passwordSpent: accountRootFlags.PasswordSpent,
  requireDestinationTag: accountRootFlags.RequireDestTag,
  requireAuthorization: accountRootFlags.RequireAuth,
  disallowIncomingCALL: accountRootFlags.DisallowCALL,
  disableMasterKey: accountRootFlags.DisableMaster,
  noFreeze: accountRootFlags.NoFreeze,
  globalFreeze: accountRootFlags.GlobalFreeze,
  defaultCall: accountRootFlags.DefaultCall
}

const AccountFlagIndices = {
  requireDestinationTag: txFlagIndices.AccountSet.asfRequireDest,
  requireAuthorization: txFlagIndices.AccountSet.asfRequireAuth,
  disallowIncomingCALL: txFlagIndices.AccountSet.asfDisallowCALL,
  disableMasterKey: txFlagIndices.AccountSet.asfDisableMaster,
  enableTransactionIDTracking: txFlagIndices.AccountSet.asfAccountTxnID,
  noFreeze: txFlagIndices.AccountSet.asfNoFreeze,
  globalFreeze: txFlagIndices.AccountSet.asfGlobalFreeze,
  defaultCall: txFlagIndices.AccountSet.asfDefaultCall
}

const AccountFields = {
  EmailHash: {name: 'emailHash', encoding: 'hex',
  length: 32, defaults: '0'},
  MessageKey: {name: 'messageKey'},
  Domain: {name: 'domain', encoding: 'hex'},
  TransferRate: {name: 'transferRate', defaults: 0, shift: 9},
  NickName: {name: 'nickname'}
}

export {
  AccountFields,
  AccountFlagIndices,
  AccountFlags
}
