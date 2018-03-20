import * as common from '../../common'
import {Amount, CalledAmount} from '../../common/types'


function parseAmount(amount: CalledAmount): Amount {
  if (typeof amount === 'string') {
    return {
      currency: 'CALL',
      value: common.dropsToCall(amount)
    }
  }
  return {
    currency: amount.currency,
    value: amount.value,
    counterparty: amount.issuer
  }
}

export default parseAmount
