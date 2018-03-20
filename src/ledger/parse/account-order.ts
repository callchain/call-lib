import BigNumber from 'bignumber.js'
import parseAmount from './amount'
import {parseTimestamp, adjustQualityForCALL} from './utils'
import {removeUndefined} from '../../common'
import {orderFlags} from './flags'

function computeQuality(takerGets, takerPays) {
  const quotient = new BigNumber(takerPays.value).dividedBy(takerGets.value)
  return quotient.toDigits(16, BigNumber.ROUND_HALF_UP).toString()
}

function parseAccountOrder(address: string, order: any): Object {
  const direction = (order.flags & orderFlags.Sell) === 0 ? 'buy' : 'sell'
  const takerGetsAmount = parseAmount(order.taker_gets)
  const takerPaysAmount = parseAmount(order.taker_pays)
  const quantity = (direction === 'buy') ? takerPaysAmount : takerGetsAmount
  const totalPrice = (direction === 'buy') ? takerGetsAmount : takerPaysAmount

  // note: immediateOrCancel and fillOrKill orders cannot enter the order book
  // so we can omit those flags here
  const specification = removeUndefined({
    direction: direction,
    quantity: quantity,
    totalPrice: totalPrice,
    passive: ((order.flags & orderFlags.Passive) !== 0) || undefined,
    expirationTime: parseTimestamp(order.expiration)
  })

  const makerExchangeRate = order.quality ?
    adjustQualityForCALL(order.quality.toString(),
      takerGetsAmount.currency, takerPaysAmount.currency) :
    computeQuality(takerGetsAmount, takerPaysAmount)
  const properties = {
    maker: address,
    sequence: order.seq,
    makerExchangeRate: makerExchangeRate
  }

  return {specification, properties}
}

export default parseAccountOrder
