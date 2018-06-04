import {validate, removeUndefined, dropsToCall} from '../common'

type AccountData = {
  Sequence: number,
  Account: string,
  Balance: string,
  Flags: number,
  LedgerEntryType: string,
  OwnerCount: number,
  PreviousTxnID: string,
  AccountTxnID?: string,
  PreviousTxnLgrSeq: number,
  index: string
}

type AccountDataResponse = {
  account_data: AccountData,
  ledger_current_index?: number,
  ledger_hash?: string,
  ledger_index: number,
  validated: boolean
}

type AccountInfoOptions = {
  ledgerVersion?: number
}

type AccountInfoResponse = {
  sequence: number,
  callBalance: string,
  ownerCount: number,
  previousInitiatedTransactionID: string,
  previousAffectingTransactionID: string,
  previousAffectingTransactionLedgerVersion: number
}
function hexToStringWide(h) {//16进制转中英文
    let a = [];
    let i = 0;
    if (h.length % 4) {
        a.push(String.fromCharCode(parseInt(h.substring(0, 4), 16)));
        i = 4;
    }
    for (; i<h.length; i+=4) {
        a.push(String.fromCharCode(parseInt(h.substring(i, i+4), 16)));
    }
    return a.join('');
}
function formatAccountInfo(response: AccountDataResponse) {
  const data = response.account_data;
  const obj = {
      sequence: data.Sequence,
      callBalance: dropsToCall(data.Balance),
      ownerCount: data.OwnerCount,
      previousInitiatedTransactionID: data.AccountTxnID,
      previousAffectingTransactionID: data.PreviousTxnID,
      previousAffectingTransactionLedgerVersion: data.PreviousTxnLgrSeq
  };
  if(data.NickName)
    obj.nickName = hexToStringWide(hexToStringWide(data.NickName));
  return removeUndefined(obj);
}

function getAccountInfo(address: string, options: AccountInfoOptions = {}
): Promise<AccountInfoResponse> {
  validate.getAccountInfo({address, options})

  const request = {
    command: 'account_info',
    account: address,
    ledger_index: options.ledgerVersion || 'validated'
  }

  return this.connection.request(request).then(formatAccountInfo)
}

export default getAccountInfo
