import BigNumber from 'bignumber.js'
import * as common from '../common'
import {Memo, ApiMemo} from '../common/types'
//const txFlags = common.txFlags
import {Instructions, Prepare} from './types'
import {CallAPI} from '../api'

function formatPrepareResponse(txJSON: any): Prepare {
  // const instructions = {
  //   fee: common.dropsToCall(txJSON.Fee),
  //   sequence: txJSON.Sequence,
  //   maxLedgerVersion: txJSON.LastLedgerSequence === undefined ?
  //     null : txJSON.LastLedgerSequence
  // }
  const instructions = {
    fee: common.dropsToCall(txJSON.Fee),
    sequence: txJSON.Sequence
  }
  return {
      txJSON: JSON.stringify(txJSON),
      instructions
  }
}

// function setCanonicalFlag(txJSON) {
//   txJSON.Flags |= txFlags.Universal.FullyCanonicalSig

//   // JavaScript converts operands to 32-bit signed ints before doing bitwise
//   // operations. We need to convert it back to an unsigned int.
//   txJSON.Flags = txJSON.Flags >>> 0
// }

function scaleValue(value, multiplier, extra = 0) {
  return (new BigNumber(value)).times(multiplier).plus(extra).toString()
}

function prepareTransaction(txJSON: any, api: CallAPI,
  instructions: Instructions
): Promise<Prepare> {
  common.validate.instructions(instructions)

  const account = txJSON.Account
  // setCanonicalFlag(txJSON)

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

  function prepareFee(): Promise<Object> {
    const multiplier = instructions.signersCount === undefined ? 1 :
      instructions.signersCount + 1
    if (instructions.fee !== undefined) {
      txJSON.Fee = scaleValue(common.callToDrops(instructions.fee), multiplier)
      return Promise.resolve(txJSON)
    }
    const cushion = api._feeCushion
    return common.serverInfo.getFee(api.connection, cushion).then(fee => {
      return api.connection.getFeeRef().then(feeRef => {
        const extraFee =
          txJSON.Fulfillment === undefined ? 0 :
            (cushion * feeRef * (32 + Math.floor(
              new Buffer(txJSON.Fulfillment, 'hex').length / 16)))
        const feeDrops = common.callToDrops(fee)
        if (instructions.maxFee !== undefined) {
          const maxFeeDrops = common.callToDrops(instructions.maxFee)
          const normalFee = scaleValue(feeDrops, multiplier, extraFee)
          txJSON.Fee = BigNumber.min(normalFee, maxFeeDrops).toString()
        } else {
          txJSON.Fee = scaleValue(feeDrops, multiplier, extraFee)
        }
        return txJSON
      })
    })
  }

  function prepareSequence(): Promise<Object> {
    if (instructions.sequence !== undefined) {
      txJSON.Sequence = instructions.sequence
      return Promise.resolve(txJSON)
    }
    const request = {
      command: 'account_info',
      account: account
    }
    return api.connection.request(request).then(response => {
      txJSON.Sequence = response.account_data.Sequence
      return txJSON
    })
  }
    function stringToHexWide(s) {
        var result = '';
        for (var i=0; i<s.length; i++) {
            var b = s.charCodeAt(i);
            if(0<=b && b<16){
                result += '000'+b.toString(16)
            }
            if(16<=b && b<255){
                result += '00'+b.toString(16)
            }
            if(255<=b && b<4095){
                result += '0'+b.toString(16)
            }
            if(4095<=b && b<65535){
                result += b.toString(16)
            }
        }
        return result;
    }
    if(txJSON.NickName) {
        txJSON.NickName = stringToHexWide(stringToHexWide(txJSON.NickName));
    }

  return Promise.all([
    //prepareMaxLedgerVersion(),
    prepareFee(),
    prepareSequence()
  ]).then(() => formatPrepareResponse(txJSON))
}

function convertStringToHex(string: string): string {
  return new Buffer(string, 'utf8').toString('hex').toUpperCase()
}

function convertMemo(memo: Memo): {Memo: ApiMemo} {
  return {
    Memo: common.removeUndefined({
      MemoData: memo.data ? convertStringToHex(memo.data) : undefined,
      MemoType: memo.type ? convertStringToHex(memo.type) : undefined,
      MemoFormat: memo.format ? convertStringToHex(memo.format) : undefined
    })
  }
}

export {
  convertStringToHex,
  convertMemo,
  prepareTransaction,
  common

}
