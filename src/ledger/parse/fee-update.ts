
import BigNumber from 'bignumber.js'
import {dropsToCall} from '../../common'

function parseFeeUpdate(tx: any) {
  const baseFeeDrops = (new BigNumber(tx.BaseFee, 16)).toString()
  return {
    baseFeeCALL: dropsToCall(baseFeeDrops),
    referenceFeeUnits: tx.ReferenceFeeUnits,
    reserveBaseCALL: dropsToCall(tx.ReserveBase),
    reserveIncrementCALL: dropsToCall(tx.ReserveIncrement)
  }
}

export default parseFeeUpdate
